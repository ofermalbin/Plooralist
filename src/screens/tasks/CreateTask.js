import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listTasksForPanel } from '../../graphql/queries';
import { createTask } from '../../graphql/mutations';

import uuid from 'react-native-uuid';

import { withCurrentUser } from '../../contexts';

import TextVoiceInput from '../../components/Voice';

import { listTasksForPanelVariables } from './util';

class CreateTask extends React.Component {

  constructor(props) {
    super(props);
  }

  onSave(name) {
    const { currentUser, panelId } = this.props;
    const input = {
      id: uuid.v4(),
      name: name,
      completed: false,
      taskPanelId: panelId,
      taskUserId: currentUser.id,
      updatedBy: currentUser.id,
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
    this.props.createTask({...offline, input});
  }

  render() {
    return (
      <TextVoiceInput onSave={this.onSave.bind(this)} navigation={this.props.navigation} />
    );
  }
}

export default withCurrentUser(compose(
  graphqlMutation(gql(createTask), variables => ({query: gql(listTasksForPanel), variables: listTasksForPanelVariables(variables.taskPanelId)}), 'Task')
)(CreateTask));
