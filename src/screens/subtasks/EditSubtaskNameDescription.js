import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateSubtask } from '../../graphql/mutations';
import { listSubtasksForTask } from '../../graphql/queries';

import { listSubtasksForTaskVariables } from './util';

import { inputStyles } from './config/stylesheets';

class EditSubtaskNameDescription extends React.Component {

  constructor(props) {
    super(props);

    const { subtask } = props.navigation.state.params;
    this.state = {
      name: subtask.name,
      description: subtask.description,
    }
    props.navigation.setParams({disabled: subtask.name.length ? false : true, onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { subtask } = this.props.navigation.state.params;
    const name = this.state.name.trim();
    const description = this.state.description ? this.state.description.trim() : null;
    const input = {
      id: subtask.id,
      expectedVersion: subtask.version,
      name,
      description
    };
    const offline = Object.assign(subtask, {offline: true, name, description, updatedAt: (new Date()).toISOString()});
    this.props.updateSubtask({input, ...offline});
    this.props.navigation.goBack();
  }

  onNameChange(name) {
    this.props.navigation.setParams({disabled: name.trim().length ? false : true, onSavePress: this.onSavePress.bind(this)});
    this.setState({
      name: name,
    });
  }

  onDescriptionChange(description) {
    this.setState({
      description: description,
    });
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
            label="Name"
            onChangeText={this.onNameChange.bind(this)}
          />
        }
      />
      <ListItem
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.description}
            autoFocus={true}
            label="Description"
            onChangeText={this.onDescriptionChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateSubtask), variables => ({query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(variables.subtaskTaskId)}), 'Subtask')
) (EditSubtaskNameDescription)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Name Description",
      headerRight: <Button type="clear" title="Update" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onSavePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
