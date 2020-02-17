import React from 'react';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { listSubtasksForTask } from '../../graphql/queries';

import { onCreateSubtask, onUpdateSubtask, onDeleteSubtask } from '../../graphql/subscriptions';

import { filter } from 'lodash';

import { ListItem } from 'react-native-elements';

import { infoTaskStyles } from './config/stylesheets';

import { Chevron } from '../../components';

import { listSubtasksForTaskVariables } from './util';

import translate from '../../translations';

class InfoTaskSubtasks extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { taskId } = this.props.navigation.state.params;
    this.props.subtasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(taskId)}
      )
    );
    this.props.subtasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(taskId)}
      )
    );
    this.props.subtasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(taskId)}
      )
    );
  }

  onPress() {
    const { taskId, isOwner } = this.props;
    this.props.navigation.navigate('Subtasks', {taskId: taskId, isTaskOwner: isOwner});
  }

  render() {
    const { isOwner, subtasks } = this.props;

    const subtasksCount = subtasks.length;
    const subtasksCompletedCount = filter(subtasks, subtask => subtask.completed).length;

    if (!subtasksCount && !isOwner) {
      return null;
    }

    return (
      <ListItem
        topDivider={true}
        bottomDivider={true}
        containerStyle={[infoTaskStyles.container, {marginTop:22}]}
        titleStyle={infoTaskStyles.title}
        subtitleStyle={infoTaskStyles.subtitle}
        rightTitleStyle={infoTaskStyles.rightTitle}
        chevron={<Chevron />}
        title={translate("Subtask.subtasks")}
        subtitle={(subtasksCompletedCount || null) && translate("Subtask.completed summery", {subtasksCompletedCount})}
        badge={(subtasksCount || null) && {
          value: subtasksCount,
        }}
        rightTitle={(!subtasksCount || null) && translate("Common.Button.add")}
        leftIcon={{ name: 'playlist-add-check', iconStyle: infoTaskStyles.leftIcon }}
        onPress={this.onPress.bind(this)}
      />
    )
  }
}

export default compose(
  graphql(gql(listSubtasksForTask), {
    options: props => {
      const { taskId } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: listSubtasksForTaskVariables(taskId)
      })
    },
    props: props => ({
      subtasks: props.data.listSubtasksForTask ? props.data.listSubtasksForTask.items : [],
      subtasksData: props.data
    }),
  }),
)(InfoTaskSubtasks);
