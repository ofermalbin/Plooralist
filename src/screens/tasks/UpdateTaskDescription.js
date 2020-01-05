import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateTask } from '../../graphql/mutations';
import { listTasksForPanel } from '../../graphql/queries';

import { withCurrentUser } from '../../contexts';

import { listTasksForPanelVariables } from './util';

import { inputStyles } from './config/stylesheets';

class UpdateTaskDescription extends React.Component {

  constructor(props) {
    super(props);

    const { task } = props.navigation.state.params;
    this.state = {
      description: task.description,
    }
    props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { task } = this.props.navigation.state.params;
    const { currentUser } = this.props;

    const description = this.state.description.trim();
    const input = {
      id: task.id,
      expectedVersion: task.version,
      description,
      updatedBy: currentUser.id,
    };
    const offline = Object.assign(task, {offline: true, description, updatedAt: (new Date()).toISOString()});
    this.props.updateTask({...offline, input});
    this.props.navigation.goBack();
  }

  onDescriptionChange(description) {
    this.props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
    this.setState({description: description});
  }

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
      <ListItem
        topDivider={true}
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.description}
            autoFocus={true}
            placeholder="Description"
            onChangeText={this.onDescriptionChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateTask), variables => ({query: gql(listTasksForPanel), variables: listTasksForPanelVariables(variables.taskPanelId)}), 'Task')
) (withCurrentUser(UpdateTaskDescription))


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Description",
      headerRight: () => <Button type="clear" title="Update" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onSavePress()} />,
      headerLeft: () => <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
