import React from 'react';

import { HeaderBackButton } from 'react-navigation-stack';

import { GiftedChat } from 'react-native-gifted-chat';
import FastImage from 'react-native-fast-image';
import aws_exports from '../../aws-exports';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';
import { graphqlMutation } from 'aws-appsync-react';

import { getTask, listMessagesForTask } from '../../graphql/queries';
import { createMessage } from '../../graphql/mutations';
import { onCreateTaskMessage, onUpdateTaskMessage, onDeleteTaskMessage } from '../../graphql/subscriptions';

import uuid from 'react-native-uuid';

import { storeFileInS3 } from '../../lib/s3';
import { sleep } from '../../lib/sleep';

import { withCurrentUser } from '../../contexts';

import { TitleTask } from '../tasks';

import Messages from './Messages';

import { listMessagesForTaskVariables } from './util';

import translate from '../../translations';

class TaskMessages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ ...this.props });
    this.setState({
      messages: this.props.messages,
    });
    const { taskId } = this.props.navigation.state.params;
    this.props.messagesData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(taskId)}
      )
    );
    this.props.messagesData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(taskId)}
      )
    );
    this.props.messagesData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(taskId)}
      )
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      messages: nextProps.messages,
    });
  }

  createMessage(typeInput) {
    const { task } = this.props.navigation.state.params;
    const { currentUser } = this.props;

    const defaultInput = {
      id: uuid.v4(),
      messagePanelId: task.taskPanelId,
      messageTaskId: task.id,
      messageSubtaskId: null,
      text: null,
      imgKey: null,
      place: null,
      messageUserId: currentUser.id
    };

    const input = Object.assign({}, defaultInput, typeInput);

    const now = new Date();
    const offline = {
      ...input,
      offline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      user: currentUser
    };

    this.props.createMessage({...offline, input: input});
  }

  async createImageMessage(fileUri) {

    const { task } = this.props.navigation.state.params;
    const { currentUser } = this.props;

    const now = new Date();

    const tempMessage = {
      id: uuid.v4(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      uri: fileUri,
      messageUserId: currentUser.id,
      user: currentUser
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, tempMessage),
    }))

    const awsKey = `${uuid.v1()}.jpeg`;
    const result = await storeFileInS3(fileUri, awsKey, "public");
    const uri = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${result.key}`;
    FastImage.preload([{uri}]);
    await sleep(1000);
    this.createMessage({imgKey: result.key});
  }

  onSend(message) {
    if (message.text) {
      this.createMessage({text: message.text});
    }
    else if (message.uri) {
      this.createImageMessage(message.uri);
    }
    else if (message.place) {
      this.createMessage({place: message.place});
    }
  }

  render() {
    return (
      <Messages taskId={this.props.taskId} messages={this.state.messages} onSend={this.onSend.bind(this)} navigation={this.props.navigation} />
    );
  }
}

const enhance = compose(
  graphql(gql(listMessagesForTask), {
    options: props => {
      const { taskId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: listMessagesForTaskVariables(taskId)
      })
    },
    props: props => ({
      messages: props.data.listMessagesForTask ? props.data.listMessagesForTask.items : [],
      messagesData: props.data
    }),
  }),
  graphql(gql(getTask), {
    options: props => {
      const { taskId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: taskId
        }
      })
    },
    props: props => ({
      task: props.data.getTask ? props.data.getTask : null,
    })
  }),
  graphqlMutation(gql(createMessage), variables => ({ query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(variables.messageTaskId)}), 'Message')
) (withCurrentUser(TaskMessages));

enhance.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: () => <TitleTask {...params} navigation={navigation} />,
    headerLeft: () => <HeaderBackButton label={translate("Common.Button.back")} onPress={() => navigation.goBack(null)} />,
  };
}

export default enhance;
