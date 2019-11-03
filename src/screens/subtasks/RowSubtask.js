import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import Swipeout from 'react-native-swipeout';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listSubtasks } from '../../graphql/queries';
import { updateSubtask, deleteSubtask } from '../../graphql/mutations';

import { withCurrentUser } from '../../contexts';

import { omit } from 'lodash';

import { listStyles } from './config/stylesheets';
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

  onPress() {
    //this.props.navigation.navigate('InfoSubtask', {subtaskId: this.props.subtask.id});
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
      'Delete Subtask',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          const { subtask } = this.props;

          const input = {
            id: subtask.id,
            expectedVersion: subtask.version
          };

          const now = new Date();
          const offline = {
            ...Object.assign({}, omit(subtask, ['__typename']), omit(input, ['expectedVersion'])),
            offline: true,
            updatedAt: now.toISOString()
          };

          this.props.deleteSubtask({...offline, input});
          //this.props.navigation.goBack();
        }},
      ]
    )
  }

  onEditNameDescriptionPress() {
    this.props.navigation.navigate('EditSubtaskNameDescription', {subtask: this.props.subtask});
  };

  render() {

    const { currentUser, isTaskOwner, subtask } = this.props;
    const isOwner = (subtask.owner === currentUser.id) || isTaskOwner;

    const leftBtns = [
      {
        text: 'Edit',
        type: 'primary',
        backgroundColor: 'blue',
        onPress: this.onEditNameDescriptionPress.bind(this)
      },
    ];

    const rightBtns = [
      {
        text: 'Delete',
        type: 'primary',
        backgroundColor: 'red',
        onPress: this.onDeletePress.bind(this)
      }
    ];

    return (
      <Swipeout
        rowID={subtask.id}
        disabled={!isOwner}
        autoClose={true}
        close={!(this.props.selected === subtask.id)}
        onOpen={(sectionID, rowID) => this.props.onSelected(rowID)}
        backgroundColor='#FFFFFF'
        left={leftBtns}
        right={rightBtns}
        sensitivity={1}
      >
        <ListItem
          containerStyle={listStyles.container}
          titleStyle={[
            listStyles.title,
            { textDecorationLine: this.state.completed ? 'line-through' : 'none' },
            { color: this.state.completed ? colors.checkedIcon : null }
          ]}
          subtitleStyle={listStyles.subtitle}
          chevron={false}
          title={subtask.name}
          subtitle={subtask.description}
          checkBox={{
            size: listStyles.checkboxContainer.width,
            checked: this.state.completed,
            checkedColor: colors.checkedIcon,
            uncheckedColor: colors.uncheckedIcon,
            onPress: this.onCompletedPress.bind(this),
            disabled: subtask.offline
          }}
          onPress={this.onPress.bind(this)}
          disabled={subtask.offline}
          disabledStyle={{backgroundColor:'red'}}
        />
      </Swipeout>
    )
  }
};

export default compose(
  graphqlMutation(gql(updateSubtask), variables => ({ query: gql(listSubtasks), variables: {filter: {subtaskTaskId: {eq: variables.subtaskTaskId}}}}), 'Subtask'),
  graphqlMutation(gql(deleteSubtask), variables => ({ query: gql(listSubtasks), variables: {filter: {subtaskTaskId: {eq: variables.subtaskTaskId}}}}), 'Subtask')
)(withCurrentUser(RowSubtask));
