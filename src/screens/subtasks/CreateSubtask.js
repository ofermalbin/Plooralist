import React from 'react';
import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listSubtasksForTask } from '../../graphql/queries';
import { createSubtask } from '../../graphql/mutations';

import uuid from 'react-native-uuid';

import { withCurrentUser } from '../../contexts';

import TextVoiceInput from '../../components/Voice';

import { listSubtasksForTaskVariables } from './util';

class CreateSubtask extends React.Component {

  constructor(props) {
    super(props);
  }

  onSave(name) {
    const { currentUser, taskId } = this.props;
    const input = {
      id: uuid.v4(),
      name: name,
      completed: false,
      subtaskTaskId: taskId,
      subtaskUserId: currentUser.id,
    };

    const now = new Date();
    const offline = {
      ...input,
      offline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      description: null,
      user: currentUser,
    };
    this.props.createSubtask({...offline, input: input});
  }

  render() {
    return (
      <TextVoiceInput onSave={this.onSave.bind(this)} navigation={this.props.navigation} />
    );
  }
}

export default compose(
  graphqlMutation(gql(createSubtask), variables => ({query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(variables.subtaskTaskId)}), 'Subtask')
)(withCurrentUser(CreateSubtask));
