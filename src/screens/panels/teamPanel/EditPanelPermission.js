import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { getPanel } from '../../../graphql/queries';
import { updatePanel } from '../../../graphql/mutations';

import { inputStyles } from '../config/stylesheets';

class EditPanelPermission extends React.Component {

  constructor(props) {
    super(props);

    const { panel } = props.navigation.state.params;
    this.state = {
      onlyManagersCreateTask: panel.onlyManagersCreateTask,
      onlyManagersEditInfo: panel.onlyManagersEditInfo,
      onlyManagersEditMembers: panel.onlyManagersEditMembers
    }
    props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { panel } = this.props.navigation.state.params;
    const onlyManagersCreateTask = this.state.onlyManagersCreateTask;
    const onlyManagersEditInfo = this.state.onlyManagersEditInfo;
    const onlyManagersEditMembers = this.state.onlyManagersEditMembers;
    const input = {
      id: panel.id,
      expectedVersion: panel.version,
      onlyManagersCreateTask,
      onlyManagersEditInfo,
      onlyManagersEditMembers
    };
    const offline = Object.assign(panel, {offline: true, onlyManagersCreateTask, onlyManagersEditInfo, onlyManagersEditMembers, updatedAt: (new Date()).toISOString()});
    this.props.updatePanel({...offline, input});
    this.props.navigation.goBack();
  }

  onCreateTaskPermissionChange(onlyManagersCreateTask) {
    this.props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
    this.setState({onlyManagersCreateTask});
  }

  onEditInfoPermissionChange(onlyManagersEditInfo) {
    this.props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
    this.setState({onlyManagersEditInfo});
  }

  onEditMembersPermissionChange(onlyManagersEditMembers) {
    this.props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
    this.setState({onlyManagersEditMembers});
  }

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
        <ListItem
          topDivider={true}
          title='Only managers create task'
          switch={{
            value: this.state.onlyManagersCreateTask,
            onValueChange: this.onCreateTaskPermissionChange.bind(this),
          }}
        />
        <ListItem
          topDivider={true}
          title='Only managers edit info'
          switch={{
            value: this.state.onlyManagersEditInfo,
            onValueChange: this.onEditInfoPermissionChange.bind(this),
          }}
        />
        <ListItem
          topDivider={true}
          bottomDivider={true}
          title='Only managers edit members'
          switch={{
            value: this.state.onlyManagersEditMembers,
            onValueChange: this.onEditMembersPermissionChange.bind(this),
          }}
        />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updatePanel), gql(getPanel), 'Panel')
) (EditPanelPermission)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Permission",
      headerRight: <Button type="clear" title="Update" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onSavePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
