import React from 'react';

import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listTasksForPanel } from '../../graphql/queries';
import { updateTask } from '../../graphql/mutations';

import { withCurrentUser } from '../../contexts';

import { listTasksForPanelVariables } from './util';

import { rowTaskStyles } from './config/stylesheets';
import colors from '../../config/colors';

import { TextNameUser } from '../users';

class RowTask extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: props.task.completed,
    }
  }

  componentWillReceiveProps(nextProps) {
    (nextProps.task.completed != this.props.task.completed) && this.setState({completed: nextProps.task.completed});
  }

  onPress() {
    this.props.navigation.navigate('InfoTask', {taskId: this.props.task.id, isMemberManager: this.props.isMemberManager});
  }

  onCompletedPress() {
    const { task, currentUser } = this.props;
    const completed = !this.state.completed;
    this.setState({completed});
    const input = {
      id: task.id,
      expectedVersion: task.version,
      completed,
      updatedBy: currentUser.id,
    };
    const offline = Object.assign(task, {offline: true, completed, updatedAt: (new Date()).toISOString()});
    this.props.updateTask({input, ...offline});
  }

  render() {
    const { task } = this.props;

    return (
      <ListItem
        containerStyle={rowTaskStyles.container}
        topDivider={false}
        bottomDivider={false}
        titleStyle={[
          rowTaskStyles.title,
          { textDecorationLine: this.state.completed ? 'line-through' : 'none' },
          { color: this.state.completed ? colors.checkedIcon : null }
        ]}
        chevron={false}
        title={task.name}
        subtitle={<TextNameUser style={rowTaskStyles.subtitle} user={task.user} />}
        checkBox={{
          size: rowTaskStyles.checkboxContainer.width,
          checked: this.state.completed,
          checkedColor: colors.checkedIcon,
          uncheckedColor: colors.uncheckedIcon,
          onPress: this.onCompletedPress.bind(this),
          disabled: task.offline
        }}
        onPress={this.onPress.bind(this)}
        disabled={task.offline}
        disabledStyle={{backgroundColor: '#F0F8FF'}}
      />
    )
  }
};

export default compose(
  graphqlMutation(gql(updateTask), variables => ({query: gql(listTasksForPanel), variables: listTasksForPanelVariables(variables.taskPanelId)}), 'Task')
)(withCurrentUser(RowTask));
