import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import { ListItem, Icon } from 'react-native-elements';

import { AvatarS3Image } from '../../../components';

import { withCurrentUser } from '../../../contexts';

import { infoAvatarStyles, infoListStyles, createByAtStyles } from '../config/stylesheets';

import MutePanel from '../MutePanel';

class InfoSinglePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, currentUser } = this.props;
    const name = 'Me';
    const imgKey = currentUser.imgKey;

    return (
      <ScrollView>
      <View>
        <AvatarS3Image
          imgKey={imgKey}
          level='protected'
          identityId={currentUser.identityId}
          name={name}
          containerStyle={infoAvatarStyles.container}
          titleStyle={infoAvatarStyles.title}
          rounded={false}
        />
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={infoListStyles.container}
          titleStyle={infoListStyles.title}
          title={name}
          leftAvatar={
            <AvatarS3Image
              imgKey={imgKey}
              imgKey={imgKey}
              level='protected'
              identityId={currentUser.identityId}
              name={name}
              containerStyle={infoListStyles.avatarContainer}
              rounded={true}
            />
          }
        />
        <MutePanel {...this.props} />
        <View style={createByAtStyles.container}>
          <Text style={createByAtStyles.text}>{`${'created at '}${moment(member.panel.createdAt).locale('en').format('LL')}.`}</Text>
        </View>
      </View>
      </ScrollView>
    )
  }
};

export default withCurrentUser(InfoSinglePanel);
