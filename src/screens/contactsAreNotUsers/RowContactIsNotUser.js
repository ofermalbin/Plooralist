import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { withContacts } from '../../contexts';

import { AvatarS3Image } from '../../components';

import { getContactByUsername, getContactName } from '../../util';

import { rowRowContactIsNotUserStyles } from './config/stylesheets';

class RowContactIsNotUser extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    const name = getContactName(this.props);
    Alert.alert('Invite Friend', name);
  }

  render() {
    const name = getContactName(this.props);
    return (
      <ListItem
        containerStyle={rowRowContactIsNotUserStyles.container}
        titleStyle={rowRowContactIsNotUserStyles.title}
        chevron={true}
        title={name}
        leftAvatar={<AvatarS3Image name={name} containerStyle={rowRowContactIsNotUserStyles.avatarContainer} rounded={true} />}
        onPress={this.onPress.bind(this)}
      />
    )
  }
};

export default withContacts(RowContactIsNotUser);
