import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { deleteTask } from '../../graphql/mutations';
import { listTasks } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

class DeleteTask extends React.Component {

  constructor(props) {
    super(props);
  }

  onDeletePress() {
    const { task } = this.props;

    const input = {
      id: task.id,
      expectedVersion: task.version,
    };

    Alert.alert(
      'Delete Task',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          this.props.deleteTask({input});
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
  graphqlMutation(gql(deleteTask), variables => ({query: gql(listTasks), variables: {filter: {taskPanelId: {eq: variables.taskPanelId }}}}), 'Task')
)(DeleteTask);
