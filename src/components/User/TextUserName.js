import React from 'react';
import { Text, Alert } from 'react-native';

import { getUserName } from '../../util';

import { withCurrentUser, withContacts } from '../../contexts';

const __capitalize_Words = function(str) {
  return str && str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

class TextUserName extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { user, currentUser, contacts } = this.props;
    return (
      <Text style={this.props.style}>{name}</Text>
    )
  }
};

export default withCurrentUser(withContacts(TextUserName));
