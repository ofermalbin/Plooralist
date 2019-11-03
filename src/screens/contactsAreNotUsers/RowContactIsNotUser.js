import React from 'react';

import { ListItem } from 'react-native-elements';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import _ from 'lodash';

import { withContacts } from '../../contexts';

import { AvatarS3Image } from '../../components';

import { getContactByUsername, getContactName } from '../../util';

import { listStyles } from './config/stylesheets';

class RowContactIsNotUser extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    alert(this.props.recordID);
  }

  render() {
    const name = getContactName(this.props);
    return (
      <ListItem
        containerStyle={listStyles.container}
        titleStyle={listStyles.title}
        chevron={true}
        title={name}
        leftAvatar={<AvatarS3Image name={name} containerStyle={listStyles.avatarContainer} rounded={true} />}
        onPress={this.onPress.bind(this)}
      />
    )
  }
};

export default withContacts(RowContactIsNotUser);
