import React from 'react';

import { HeaderBackButton } from 'react-navigation-stack';

import { Button, Icon } from 'react-native-elements';

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

import { TitleTask } from '../tasks';

import { PhotoEdit } from '../photos';

import PhotosGrid from '../photos/PhotosGrid';

import { listMessagesForTaskVariables } from './util';

import { filter, orderBy } from 'lodash';

import uuid from 'react-native-uuid';

import { storeFileInS3 } from '../../lib/s3';
import { sleep } from '../../lib/sleep';

import { withCurrentUser } from '../../contexts';

import translate from '../../translations';

class TaskPhotos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };

    props.navigation.setParams({onAddPress: this.onAddPress.bind(this)});
  }

  componentDidMount() {

    this.props.navigation.setParams({ ...this.props, disabled: false });
    this.setState({
      photos: orderBy(filter(this.props.messages, message => message.imgKey), ['updatedAt'], ['desc']),
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
      photos: orderBy(filter(nextProps.messages, message => message.imgKey), ['updatedAt'], ['desc']),
    });
  }

  async createMessage(fileUri) {
    const { task, currentUser } = this.props;

    const awsKey = `${uuid.v1()}.jpeg`;
    const result = await storeFileInS3(fileUri, awsKey, "public");
    const uri = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${result.key}`;
    FastImage.preload([{uri}]);
    await sleep(1000);

    const input = {
      id: uuid.v4(),
      messagePanelId: task.taskPanelId,
      messageTaskId: task.id,
      messageSubtaskId: null,
      text: null,
      imgKey: result.key,
      place: null,
      messageUserId: currentUser.id
    };

    const now = new Date();
    const offline = {
      ...input,
      offline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      user: currentUser
    };

    this.props.createMessage({...offline, input: input});
    this.props.navigation.setParams({ ...this.props, disabled: false });
  }

  onAddPress() {
    this.props.navigation.setParams({ ...this.props, disabled: true });
    PhotoEdit({
      photo: null,
      updatePhoto: (photo) => {
        this.setState(previousState => ({
          photos: [{source: photo}, ...previousState.photos],
        }))
        this.createMessage(photo);
      },
      didCancel: () => this.props.navigation.setParams({ ...this.props, disabled: false })
    });
  };

  render() {
    return (
      <PhotosGrid photos={this.state.photos} navigation={this.props.navigation} />
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
) (withCurrentUser(TaskPhotos));

enhance.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: () => <TitleTask {...params} navigation={navigation} />,
    headerRight: () => <Button type="clear" title={translate("Common.Button.add")} titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
    headerLeft: () => <HeaderBackButton label={translate("Common.Button.back")} disabled={params.disabled} onPress={() => navigation.goBack(null)} />,
  };
}

export default enhance;
