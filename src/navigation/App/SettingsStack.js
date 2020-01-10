import React from 'react';

import { Button, Icon } from 'react-native-elements';

import Settings from '../../screens/settings';
import { UpdateCurrentUserName, UpdateCurrentUserEmail  } from '../../screens/currentUser';

import { createStackNavigator } from "react-navigation-stack";

import translations from '../../translations';

export default createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      title: translations("Setting.settings"),
    }),
  },
  UpdateCurrentUserName: {
    screen: UpdateCurrentUserName,
  },
  UpdateCurrentUserEmail: {
    screen: UpdateCurrentUserEmail,
  },
});
