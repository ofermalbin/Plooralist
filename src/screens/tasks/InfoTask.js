import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { getTask, listTasksForPanel } from '../../graphql/queries';
import { updateTask } from '../../graphql/mutations';

import moment from 'moment/min/moment-with-locales.js';

import { filter } from 'lodash';

import { ListItem } from 'react-native-elements';

import { withCurrentUser } from '../../contexts';

import colors from '../../config/colors';
import { infoTaskStyles, createByAtStyles } from './config/stylesheets';

import { Loading, S3Image, AvatarS3Image, Chevron, CreatedByText, CreatedAtText } from '../../components';

import InfoTaskSubtasks from './InfoTaskSubtasks';
import InfoTaskPhotos from './InfoTaskPhotos';
import InfoTaskMessages from './InfoTaskMessages';

import TimeNotifications from '../timeNotifications';
import PlaceNotifications from '../placeNotifications';
import DeleteTask from './DeleteTask';

import { listTasksForPanelVariables, listMessagesForTaskVariables, listSubtasksForTaskVariables } from './util';

import translate from '../../translations';

class InfoTask extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      completed: props.task ? props.task.completed : null
    }
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

  render() {
    const { isMemberManager } = this.props.navigation.state.params;
    const { task, currentUser, subtasks, messages } = this.props;

    if (!task || !currentUser) {
      return (
        <Loading />
      );
    }

    const isOwner = (task.taskUserId === currentUser.id) || isMemberManager;

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
          chevron={isOwner && <Chevron />}
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
          chevron={isOwner && <Chevron />}
          title={task.description ? task.description : translate("Task.task description")}
          onPress={isOwner ? this.onUpdateDescriptionPress.bind(this) : null}
          disabled={task.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
        <InfoTaskSubtasks taskId={task.id} isOwner={isOwner} navigation={this.props.navigation}/>
        <InfoTaskPhotos taskId={task.id} isOwner={isOwner} navigation={this.props.navigation}/>
        <InfoTaskMessages taskId={task.id} panelId={this.props.task.taskPanelId} isOwner={isOwner} navigation={this.props.navigation}/>
        <TimeNotifications {...this.props} isOwner={isOwner} />
        <PlaceNotifications {...this.props} isOwner={isOwner} />
        {isOwner && <DeleteTask {...this.props} />}
        <CreatedByText user={task.user} />
        <CreatedAtText createdAt={task.createdAt} />
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
  graphqlMutation(gql(updateTask), variables => ({query: gql(listTasksForPanel), variables: listTasksForPanelVariables(variables.taskPanelId)}), 'Task')
)(withCurrentUser(InfoTask));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: () => <HeaderBackButton label={translate("Common.Button.back")} onPress={() => {navigation.goBack(null);}} />,
      headerTitle: translate("Task.task info"),
    };
}

export default enhance;

/*<ProfileName textStyle={createByAtStyles.text} params={{user_id: task.createdBy}} />*/
