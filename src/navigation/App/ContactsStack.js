import React from 'react';

import { Button, Icon } from 'react-native-elements';

import Contacts from '../../screens/contacts/Contacts';
import InviteFriends from '../../screens/inviteFriends/InviteFriends';

import { createStackNavigator } from "react-navigation-stack";

export default createStackNavigator({
  Contacts: {
    screen: Contacts,
    navigationOptions: ({ navigation }) => ({
      title: 'Contacts',
      headerLeftContainerStyle: {
        backgroundColor: 'white',
      },
      headerRight: <Button
        type="clear"
        icon={{
          name: 'search',
          //color: colors.headerIcon,
        }}
        title=''
        onPress={() => navigation.navigate('searchContacts')}
      />,
    }),
  },
  InviteFriends: {
    screen: InviteFriends,
    navigationOptions: ({ navigation }) => ({
      title: 'Invite Friends',
      headerRight: <Button
        type="clear"
        icon={{
          name: 'search',
          //color: colors.headerIcon,
        }}
        title=''
        onPress={() => navigation.navigate('searchInviteFriends')}
      />,
    }),
  },
});
