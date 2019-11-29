import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { getTask, listTasksForPanel, listSubtasksForTask } from '../../graphql/queries';
import { updateTask } from '../../graphql/mutations';

import { onCreateSubtask, onUpdateSubtask, onDeleteSubtask } from '../../graphql/subscriptions';

import moment from 'moment/min/moment-with-locales.js';

import { filter } from 'lodash';

import { ListItem } from 'react-native-elements';

import { withCurrentUser, withContacts } from '../../contexts';

import colors from '../../config/colors';
import { infoTaskStyles, createByAtStyles } from './config/stylesheets';

import { TextNameUser } from '../users';

import Loading from '../../components/Loading';

import TimeNotifications from '../timeNotifications';
import PlaceNotifications from '../placeNotifications';
import MuteTask from './MuteTask';
import DeleteTask from './DeleteTask';

class InfoTask extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: props.task ? props.task.completed : null
    }
  }

  componentDidMount() {
    const { taskId } = this.props.navigation.state.params;
    this.props.subtasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: {subtaskTaskId: taskId}}
      )
    );
    this.props.subtasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: {subtaskTaskId: taskId}}
      )
    );
    this.props.subtasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteSubtask), variables: {subtaskTaskId: taskId}},
        {query: gql(listSubtasksForTask), variables: {subtaskTaskId: taskId}}
      )
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({completed: nextProps.task ? nextProps.task.completed : null});
  }

  onUpdateNamePress() {
    this.props.navigation.navigate('UpdateTaskName', {task: this.props.task});
  };

  onUpdateDescriptionPress() {
    this.props.navigation.navigate('UpdateTaskDescription', {task: this.props.task});
  };

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

  onMessagesPress() {
    const { task } = this.props;
    this.props.navigation.navigate('TaskMessages', {taskId: this.props.task.id});
  }

  onSubtasksPress() {
    const { isPanelOwner } = this.props.navigation.state.params;
    const { task, currentUser } = this.props;
    const isTaskOwner = (task.taskUserId === currentUser.id) || isPanelOwner;

    this.props.navigation.navigate('Subtasks', {taskId: this.props.task.id, isTaskOwner: isTaskOwner});
  }

  render() {
    const { isPanelOwner } = this.props.navigation.state.params;
    const { task, currentUser, subtasks } = this.props;

    if (!task || !currentUser) {
      return (
        <Loading />
      );
    }

    const isOwner = (task.taskUserId === currentUser.id) || isPanelOwner;
    const subtasksCount = subtasks.length;
    const subtasksCompletedCount = filter(subtasks, subtask => subtask.completed).length;

    return (
      <ScrollView>
      <View>
        <ListItem
          topDivider={false}
          bottomDivider={false}
          containerStyle={infoTaskStyles.container}
          titleStyle={[
            infoTaskStyles.title,
            { textDecorationLine: this.state.completed ? 'line-through' : 'none' },
            { color: this.state.completed ? colors.checkedIcon : null }
          ]}
          chevron={isOwner}
          title={task.name}
          checkBox={{
            size: infoTaskStyles.checkboxContainer.width,
            checked: this.state.completed,
            checkedColor: colors.checkedIcon,
            uncheckedColor: colors.uncheckedIcon,
            onPress: this.onCompletedPress.bind(this),
            disabled: task.offline
          }}
          onPress={isOwner ? this.onUpdateNamePress.bind(this) : null}
          disabled={task.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={infoTaskStyles.container}
          titleStyle={task.description ? infoTaskStyles.title : infoTaskStyles.lightTitle}
          chevron={isOwner}
          title={task.description ? task.description : 'Description'}
          onPress={isOwner ? this.onUpdateDescriptionPress.bind(this) : null}
          disabled={task.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
        {((subtasksCount || isOwner) || null) && <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={[infoTaskStyles.container, {marginTop:22}]}
          titleStyle={infoTaskStyles.title}
          subtitleStyle={infoTaskStyles.subtitle}
          rightTitleStyle={infoTaskStyles.rightTitle}
          chevron={true}
          title='Subtasks'
          subtitle={(subtasksCount || null) && `${subtasksCount}${' subtasks '}${subtasksCompletedCount}${' completed'}`}
          rightTitle={(!subtasksCount || null) && 'Add'}
          leftIcon={{ name: 'playlist-add-check', iconStyle: infoTaskStyles.leftIcon }}
          onPress={this.onSubtasksPress.bind(this)}
        />}
        <TimeNotifications {...this.props} isOwner={isOwner} />
        <PlaceNotifications {...this.props} isOwner={isOwner} />
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={[infoTaskStyles.container, {marginTop:22}]}
          titleStyle={infoTaskStyles.title}
          subtitleStyle={infoTaskStyles.subtitle}
          rightTitleStyle={infoTaskStyles.rightTitle}
          chevron={true}
          title='Chat'
          leftIcon={{ type: 'material', name: 'attach-file', iconStyle: infoTaskStyles.leftIcon }}
          onPress={this.onMessagesPress.bind(this)}
        />
        <MuteTask {...this.props} />
        {isOwner && <DeleteTask {...this.props} />}
        <View style={[createByAtStyles.container, {flexDirection: 'row'}]}>
          <Text style={createByAtStyles.text}>{`${'created by '}`}</Text>
          <TextNameUser style={createByAtStyles.text} user={task.user} />
          <Text style={createByAtStyles.text}>{`${'.'}`}</Text>
        </View>
        <View style={createByAtStyles.container}>
          <Text style={createByAtStyles.text}>{`${'created at '}${moment(task.createdAt).locale('en').format('LL')}.`}</Text>
        </View>
        </View>
      </ScrollView>
    )
  }
}

const enhance = compose(
  graphql(gql(getTask), {
    options: props => {
      const { taskId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: taskId
        }
      })
    },
    props: props => ({
      task: props.data.getTask ? props.data.getTask : null,
    })
  }),
  graphql(gql(listSubtasksForTask), {
    options: props => {
      const { taskId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          subtaskTaskId: taskId, sortDirection: "DESC", limit: 100
        }
      })
    },
    props: props => ({
      subtasks: props.data.listSubtasksForTask ? props.data.listSubtasksForTask.items : [],
      subtasksData: props.data
    }),
  }),
  graphqlMutation(gql(updateTask), variables => ({query: gql(listTasksForPanel), variables: {taskPanelId: variables.taskPanelId}}), 'Task')
)(withCurrentUser(InfoTask));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: <HeaderBackButton onPress={() => {navigation.goBack(null);}} />,
      headerTitle: "Task Info",
    };
}

export default enhance;

/*<ProfileName textStyle={createByAtStyles.text} params={{user_id: task.createdBy}} />*/
