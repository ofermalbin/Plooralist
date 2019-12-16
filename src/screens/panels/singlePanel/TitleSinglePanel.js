import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { AvatarS3Image } from '../../../components';

import { withCurrentUser } from '../../../contexts';

import { titlePanelStyles } from '../config/stylesheets';

class TitleSinglePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser, onPress } = this.props;
    const name = 'Me';
    const imgKey = currentUser.imgKey;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={titlePanelStyles.container}>
          <AvatarS3Image
            imgKey={imgKey}
            level='protected'
            identityId={currentUser.identityId}
            name={name}
            containerStyle={titlePanelStyles.avatarContainer}
            rounded={true}
          />
          <View style={titlePanelStyles.nameContainer}>
            <Text style={titlePanelStyles.nameText}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
};

export default withCurrentUser(TitleSinglePanel);
