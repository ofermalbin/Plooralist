import React from 'react';

import { Text } from 'react-native';

import { getCurrentUserName, getUserName } from '../../util';

import { withCurrentUser, withContacts } from '../../contexts';

class TextNameUser extends React.Component {

  render() {

    const { style, user, currentUser, contacts  } = this.props;
    const name = (user.id === currentUser.id) ? getCurrentUserName() : getUserName(user, contacts);

    return (
      <Text style={style}>{name}</Text>
    )
  }
};

export default withCurrentUser(withContacts(TextNameUser));
