import React from 'react';

import { HeaderBackButton } from 'react-navigation-stack';

import ContactsAreNotUsers from '../contactsAreNotUsers';

import translate from '../../translations';

class InviteFriends extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: translate("InviteFriend.invite friends"),
        headerLeft: () => <HeaderBackButton label={translate("Common.Button.back")} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ContactsAreNotUsers navigation={this.props.navigation} />
    );
  }
}

export default InviteFriends;
