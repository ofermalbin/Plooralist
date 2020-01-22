import React from 'react';

import Contacts from '../../screens/contacts/Contacts';
import InviteFriends from '../../screens/inviteFriends/InviteFriends';

import translate from '../../translations';

import { createStackNavigator } from "react-navigation-stack";

export default createStackNavigator({
  Contacts: {
    screen: Contacts,
  },
  InviteFriends: {
    screen: InviteFriends,
  },
});
