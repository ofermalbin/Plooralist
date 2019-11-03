import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { AvatarS3Image } from '../../../components';

import Loading from '../../../components/Loading';

import { withContacts } from '../../../contexts';

import { find } from 'lodash';

import { getUserName } from '../../../util';

import { titlePanelStyles } from '../config/stylesheets';

class TitleCouplePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, contacts, onPress } = this.props;
    const couple = find(member.panel.members.items, couple => couple.memberUserId != member.memberUserId);

    const name = getUserName(couple.user, contacts);
    const imgKey = couple.user.imgKey;

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
            <Text style={titlePanelStyles.nameText}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
};

export default withContacts(TitleCouplePanel);
