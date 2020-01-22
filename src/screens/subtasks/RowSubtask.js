import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listSubtasksForTask } from '../../graphql/queries';
import { updateSubtask, deleteSubtask } from '../../graphql/mutations';

import { connectActionSheet } from '@expo/react-native-action-sheet';

import { withCurrentUser } from '../../contexts';

import { listSubtasksForTaskVariables } from './util';

import translate from '../../translations';

import { rowSubtaskStyles } from './config/stylesheets';
import colors from '../../config/colors';

class RowSubtask extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: props.subtask.completed,
    }
  }

  componentWillReceiveProps(nextProps) {
    (nextProps.subtask.completed != this.props.subtask.completed) && this.setState({completed: nextProps.subtask.completed});
  }

  onCompletedPress() {
    const { subtask } = this.props;
    const completed = !this.state.completed;
    this.setState({completed});
    const input = {
      id: subtask.id,
      expectedVersion: subtask.version,
      completed
    };
    const offline = Object.assign(subtask, {offline: true, completed, updatedAt: (new Date()).toISOString()});
    this.props.updateSubtask({input, ...offline});
  }

  onDeletePress() {
    Alert.alert(
      translate("Subtask.delete subtask"),
      translate("Common.Alert.are you sure?"),
      [
        {text: translate("Common.Button.cancel")},
        {text: translate("Common.Button.ok"), onPress: () => {
          const { subtask } = this.props;
          const input = {
            id: subtask.id,
            expectedVersion: subtask.version,
          };
          const offline = Object.assign(subtask, {offline: true});
          this.props.deleteSubtask({...offline, input});
        }},
      ]
    )
  }

  onEditPress() {
    this.props.navigation.navigate('EditSubtaskNameDescription', {subtask: this.props.subtask});
  };

  onActionPress() {
    const { currentUser, isTaskOwner, subtask } = this.props;
    const isOwner = (subtask.owner === currentUser.id) || isTaskOwner;

    /*if (!isOwner) {
      return;
    }*/

    const title = subtask.name;
    const options = [
      translate("Subtask.delete subtask"),
      translate("Subtask.edit subtask"),
      translate("Common.Button.cancel")
    ];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        title,
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0: this.onDeletePress.bind(this)();
                  break;
          case 1: this.onEditPress.bind(this)();
                  break;
          default: ;
                  break;
        }
      },
    );
  };

  render() {

    const { subtask } = this.props;

    return (
      <ListItem
        containerStyle={rowSubtaskStyles.container}
        titleStyle={[
          rowSubtaskStyles.title,
          { textDecorationLine: this.state.completed ? 'line-through' : 'none' },
          { color: this.state.completed ? colors.checkedIcon : null }
        ]}
        subtitleStyle={rowSubtaskStyles.subtitle}
        title={subtask.name}
        subtitle={subtask.description}
        checkBox={{
          size: rowSubtaskStyles.checkboxContainer.width,
          checked: this.state.completed,
          checkedColor: colors.checkedIcon,
          uncheckedColor: colors.uncheckedIcon,
          onPress: this.onCompletedPress.bind(this),
          disabled: subtask.offline
        }}
        onPress={this.onActionPress.bind(this)}
        disabled={subtask.offline}
        disabledStyle={{backgroundColor: '#F0F8FF'}}
      />
    )
  }
};

export default compose(
  graphqlMutation(gql(updateSubtask), variables => ({ query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(variables.subtaskTaskId)}), 'Subtask'),
  graphqlMutation(gql(deleteSubtask), variables => ({ query: gql(listSubtasksForTask), variables: listSubtasksForTaskVariables(variables.subtaskTaskId)}), 'Subtask')
)(withCurrentUser(connectActionSheet(RowSubtask)));
