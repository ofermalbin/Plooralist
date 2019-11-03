import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateTask } from '../../graphql/mutations';
import { listTasks } from '../../graphql/queries';

import { withCurrentUser } from '../../contexts';

import { inputStyles } from './config/stylesheets';

class UpdateTaskName extends React.Component {

  constructor(props) {
    super(props);

    const { task } = props.navigation.state.params;
    this.state = {
      name: task.name,
    }
    props.navigation.setParams({disabled: task.name.length ? false : true, onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { task } = this.props.navigation.state.params;
    const { currentUser } = this.props;

    const name = this.state.name.trim();
    const input = {
      id: task.id,
      expectedVersion: task.version,
      name,
      updatedBy: currentUser.id,
    };
    const offline = Object.assign(task, {offline: true, name, updatedAt: (new Date()).toISOString()});
    this.props.updateTask({...offline, input});
    this.props.navigation.goBack();
  }

  onNameChange(name) {
    this.props.navigation.setParams({disabled: name.trim().length ? false : true, onSavePress: this.onSavePress.bind(this)});
    this.setState({name: name});
  }

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
      <ListItem
        topDivider={true}
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.name}
            autoFocus={true}
            placeholder="Name"
            onChangeText={this.onNameChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateTask), variables => ({query: gql(listTasks), variables: {filter: {taskPanelId: {eq: variables.taskPanelId}}}}), 'Task')
) (withCurrentUser(UpdateTaskName))


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Name",
      headerRight: <Button type="clear" title="Update" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onSavePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
