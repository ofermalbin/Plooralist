import React from 'react';

import ContactsAreNotUsers from '../contactsAreNotUsers';

class InviteFriends extends React.Component {

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
