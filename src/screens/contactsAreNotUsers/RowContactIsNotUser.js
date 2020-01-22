import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { withContacts } from '../../contexts';

import { AvatarS3Image, Chevron } from '../../components';

import { getContactByUsername, getContactName } from '../../util';

import { rowRowContactIsNotUserStyles } from './config/stylesheets';

import translate from '../../translations';

class RowContactIsNotUser extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    const name = getContactName(this.props);
    Alert.alert(translate("InviteFriend.invite friend"), name);
  }

  render() {
    const name = getContactName(this.props);
    return (
      <ListItem
        containerStyle={rowRowContactIsNotUserStyles.container}
        titleStyle={rowRowContactIsNotUserStyles.title}
        chevron={<Chevron />}
        title={name}
        leftAvatar={<AvatarS3Image
          name={name}
          size='medium'
          rounded={true}
        />}
        onPress={this.onPress.bind(this)}
      />
    )
  }
};

export default withContacts(RowContactIsNotUser);
