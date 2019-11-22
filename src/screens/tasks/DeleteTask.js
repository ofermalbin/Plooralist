import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { deleteTask } from '../../graphql/mutations';
import { listTasksForPanel } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

class DeleteTask extends React.Component {

  constructor(props) {
    super(props);
  }

  onDeletePress() {
    Alert.alert(
      'Delete Task',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          const { task } = this.props;
          const input = {
            id: task.id,
            expectedVersion: task.version,
          };
          const offline = Object.assign(task, {offline: true});
          this.props.deleteTask({...offline, input});
          this.props.navigation.goBack();
        }},
      ]
    )
  }

  render() {
    return (
      <ListItem
        topDivider={true}
        bottomDivider={true}
        containerStyle={[infoListStyles.container, {marginTop:22}]}
        titleStyle={[infoListStyles.title, infoListStyles.removeText]}
        chevron={false}
        title='Delete'
        onPress={this.onDeletePress.bind(this)}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(deleteTask), variables => ({query: gql(listTasksForPanel), variables: {taskPanelId: variables.taskPanelId, sortDirection: 'DESC'}}), 'Task')
)(DeleteTask);
