import React from 'react';

import { ListItem } from 'react-native-elements';

import { withContacts } from '../../../contexts';

import { AvatarS3Image } from '../../../components';

import { getUserName } from '../../../util';

import { rowPanelStyles } from '../config/stylesheets';

class RowHorizontalPotentialUser extends React.Component {

  constructor(props) {
    super(props);
  }

  onDeleteAvatarPress() {
    this.props.onDeleteAvatarPress && this.props.onDeleteAvatarPress(this.props.user);
  }

  render() {
    const { user, contacts } = this.props;
    const name = getUserName(user, contacts)
    return (
      <ListItem
        containerStyle={rowPanelStyles.container}
        leftAvatar={
          <AvatarS3Image
            imgKey={user.imgKey}
            level='protected'
            identityId={user.identityId}
            name={name}
            containerStyle={rowPanelStyles.avatarContainer}
            rounded={true}
            showEditButton={true}
            editButton={{
              name: 'delete-forever',
              type: 'material',
              size: 16,
              onPress: this.onDeleteAvatarPress.bind(this)
            }}
          />
        }
      />
    )
  }
};

export default withContacts(RowHorizontalPotentialUser);
