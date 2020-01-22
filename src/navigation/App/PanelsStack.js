import React from 'react';

import { Button, Icon } from 'react-native-elements';

import Panels, { InfoPanel, SelectPanel, CreateTeamPanel, EditPanelName, EditPanelPermission, CreateMembers, AddMembers } from '../../screens/panels';
import Tasks, { InfoTask, UpdateTaskName, UpdateTaskDescription } from '../../screens/tasks';
import { CreateTimeNotification, EditTimeNotification, EditTimeNotificationRecurrenceCustom } from '../../screens/timeNotifications';
import { CreatePlaceNotification, EditPlaceNotification, EditPlaceNotificationRadius } from '../../screens/placeNotifications';
import Subtasks, { EditSubtaskNameDescription } from '../../screens/subtasks';
import { TaskMessages } from '../../screens/messages';
import { Voice2Text } from '../../components/Voice';

import PhotoMax from '../../screens/photos';

import { createStackNavigator } from "react-navigation-stack";

import translate from '../../translations';

export default createStackNavigator({
  Panels: {
    screen: Panels,
  },
  SelectPanel: {
    screen: SelectPanel,
    navigationOptions: ({ navigation, screenProps }) => {
      return {
        title: translate("Panel.select panel")
      };
    }
  },
  CreateMembers: {
    screen: CreateMembers,
  },
  AddMembers: {
    screen: AddMembers,
  },
  CreateTeamPanel: {
    screen: CreateTeamPanel,
  },
  InfoPanel: {
    screen: InfoPanel,
  },
  PhotoMax: {
    screen: PhotoMax,
    navigationOptions: {
      header: null,
    },
  },
  Voice2Text: {
    screen: Voice2Text,
  },
  EditPanelName: {
    screen: EditPanelName,
  },
  EditPanelPermission: {
    screen: EditPanelPermission,
  },
  Tasks: {
    screen: Tasks,
  },
  InfoTask: {
    screen: InfoTask,
  },
  UpdateTaskName: {
    screen: UpdateTaskName,
  },
  UpdateTaskDescription: {
    screen: UpdateTaskDescription,
  },
  CreateTimeNotification: {
    screen: CreateTimeNotification,
  },
  EditTimeNotification: {
    screen: EditTimeNotification,
  },
  EditTimeNotificationRecurrenceCustom: {
    screen: EditTimeNotificationRecurrenceCustom,
  },
  CreatePlaceNotification: {
    screen: CreatePlaceNotification,
  },
  EditPlaceNotification: {
    screen: EditPlaceNotification,
  },
  EditPlaceNotificationRadius: {
    screen: EditPlaceNotificationRadius,
  },
  TaskMessages: {
    screen: TaskMessages,
  },
  Subtasks: {
    screen: Subtasks,
  },
  EditSubtaskNameDescription: {
    screen: EditSubtaskNameDescription,
  },
});
