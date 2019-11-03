import React from 'react';

import { ListItem } from 'react-native-elements';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import _ from 'lodash';

import { withContacts } from '../../../contexts';

import colors from '../../../config/colors';

import { AvatarS3Image } from '../../../components';

import { getContactByUsername, getContactName } from '../../../util';

import { listStyles } from '../config/stylesheets';

class RowViewPotentialUser extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const name = getContactName(getContactByUsername(this.props.contacts, this.props.phoneNumber)) || this.props.phoneNumber;
    return (
      <ListItem
        containerStyle={listStyles.container}
        titleStyle={listStyles.title}
        title={name}
        leftAvatar={
          <AvatarS3Image
            imgKey={this.props.imgKey}
            name={name}
            containerStyle={listStyles.avatarContainer}
            rounded={true}
          />
        }
      />
    )
  }
};

export default withContacts(RowViewPotentialUser);
