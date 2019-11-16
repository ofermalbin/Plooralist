import React from 'react';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';
import { graphqlMutation } from 'aws-appsync-react';

import { getTask, listMessagesForTask } from '../../graphql/queries';
import { createMessage } from '../../graphql/mutations';
import { onCreateTaskMessage, onUpdateTaskMessage, onDeleteTaskMessage } from '../../graphql/subscriptions';

import { pick } from 'lodash';

import { withCurrentUser } from '../../contexts';

import { TitleTask } from '../tasks';

import Messages from './Messages';

class TaskMessages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ ...this.props });
    this.setState({
      messages: this.props.messages,
    });
    const { taskId } = this.props.navigation.state.params;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: {messageTaskId: taskId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: {messageTaskId: taskId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: {messageTaskId: taskId}}
      )
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      messages: nextProps.messages,
    });
  }

  onSend(message) {

    const { task } = this.props.navigation.state.params;
    const { currentUser } = this.props;

    const input = {
      messagePanelId: task.taskPanelId,
      messageTaskId: task.id,
      messageSubtaskId: null,
      offline: true,
      text: message.text || null,
      imgKey: message.imgKey || null,
      place: message.place || null,
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
        variables: {
          messageTaskId: taskId
        }
      })
    },
    props: props => ({
      messages: props.data.listMessagesForTask ? props.data.listMessagesForTask.items : [],
      data: props.data
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
  graphqlMutation(gql(createMessage), variables => ({ query: gql(listMessagesForTask), variables: {messageTaskId: variables.messageTaskId}}), 'Message')
) (withCurrentUser(TaskMessages));

enhance.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: <TitleTask {...params} navigation={navigation} />,
    headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
  };
}

export default enhance;
