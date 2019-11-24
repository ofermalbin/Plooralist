import React from 'react';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { getTask, listSubtasksForTask } from '../../graphql/queries';
import { onCreateSubtask, onUpdateSubtask, onDeleteSubtask } from '../../graphql/subscriptions';


import { TitleTask } from '../tasks';
import ListSubtasks from './ListSubtasks';

class Subtasks extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { taskId } = this.props.navigation.state.params;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: {subtaskTaskId: taskId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: {subtaskTaskId: taskId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: {subtaskTaskId: taskId}}
      )
    );
  }

  render() {
    const { isTaskOwner } = this.props.navigation.state.params;
    return (
      <ListSubtasks {...this.props} isTaskOwner={isTaskOwner}/>
    );
  }
}

const enhance = compose(
  graphql(gql(listSubtasksForTask), {
    options: props => {
      const { taskId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          subtaskTaskId: taskId, sortDirection: "DESC", limit: 100
        }
      })
    },
    props: props => ({
      subtasks: props.data.listSubtasksForTask ? props.data.listSubtasksForTask.items : [],
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
) (Subtasks);

enhance.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: <TitleTask {...params} navigation={navigation} />,
    headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
  };
}

export default enhance;
