import React from 'react';

import { Button, Icon } from 'react-native-elements';

import PanelsStack from './PanelsStack'
import ContactsStack from './ContactsStack'
import SettingsStack from './SettingsStack'

import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

export default createBottomTabNavigator({
  PanelsStack: {
    screen: PanelsStack,
    navigationOptions: {
      tabBarLabel: 'Tasks',
      tabBarIcon: ({ tintColor }) => <Icon name="list" color={tintColor} />,
    },
  },
  ContactsStack: {
    screen: ContactsStack,
    navigationOptions: {
      tabBarLabel: 'Contacts',
      tabBarIcon: ({ tintColor }) => <Icon type="material-community" name="account-group" color={tintColor} />
    },
  },
  SettingsStack: {
    screen: SettingsStack,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => <Icon name="settings" color={tintColor} />,
    },
  }},
  {
    //tabBarPosition: 'bottom',
    tabBarOptions: {
      upperCaseLabel: true,
      showIcon: true,
      indicatorStyle: {
        height: 0,
      },
      //activeTintColor: '#e91e63',
      style: {
        height: 54,
        //backgroundColor: "#5fb8f6",
        //backgroundColor: colors.headerIcon,
      },
      tabStyle: {
        height: 54,
      },
      labelStyle: {
        fontSize: 12.5,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
      },
      /*IconStyle: {
        width: 11.7,
        height: 11,
        borderRadius: 1.5,
      },*/
    }
  },
  {
    //tabBarPosition: 'bottom',
    tabBarOptions: {
      upperCaseLabel: true,
      showIcon: true,
      indicatorStyle: {
        height: 0,
      },
      //activeTintColor: '#e91e63',
      style: {
        height: 54,
        //backgroundColor: "#5fb8f6",
        //backgroundColor: colors.headerIcon,
      },
      tabStyle: {
        height: 54,
      },
      labelStyle: {
        fontSize: 12.5,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
      },
      /*IconStyle: {
        width: 11.7,
        height: 11,
        borderRadius: 1.5,
      },*/
    },
  },
);
