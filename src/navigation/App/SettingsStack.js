import React from 'react';

import { Button, Icon } from 'react-native-elements';

import Settings from '../../screens/settings';
import { UpdateCurrentUserName, UpdateCurrentUserLocale, UpdateCurrentUserEmail  } from '../../screens/currentUser';

import { createStackNavigator } from "react-navigation-stack";

export default createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      headerLeftContainerStyle: {
        backgroundColor: 'white',
      },
    }),
  },
  UpdateCurrentUserName: {
    screen: UpdateCurrentUserName,
  },
  UpdateCurrentUserLocale: {
    screen: UpdateCurrentUserLocale,
  },
  UpdateCurrentUserEmail: {
    screen: UpdateCurrentUserEmail,
  },
});
