import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { AvatarS3Image } from '../../../components';

import { titlePanelStyles } from '../config/stylesheets';

import { ListHorizontalMembersNames } from '../members'

class TitleTeamPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, panel, onPress } = this.props;
    const name = panel.name;
    const imgKey = panel.imgKey;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={titlePanelStyles.container}>
          <AvatarS3Image
            imgKey={imgKey}
            name={name}
            containerStyle={titlePanelStyles.avatarContainer}
            rounded={true}
          />
          <View style={titlePanelStyles.nameContainer}>
            <Text style={titlePanelStyles.teamNameText}>{name}</Text>
            <ListHorizontalMembersNames {...this.props} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
};

export default TitleTeamPanel;
