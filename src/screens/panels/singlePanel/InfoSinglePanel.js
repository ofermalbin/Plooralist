import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import { ListItem, Icon } from 'react-native-elements';

import { AvatarS3Image, CreatedAtText } from '../../../components';

import { withCurrentUser } from '../../../contexts';

import { getCurrentUserName } from '../../../util';

import { infoAvatarStyles, infoListStyles, createByAtStyles } from '../config/stylesheets';

import MutePanel from '../MutePanel';

class InfoSinglePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, panel, currentUser } = this.props;
    const name = getCurrentUserName();
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
              size='medium'
              rounded={true}
            />
          }
        />
        <MutePanel {...this.props} />
        <CreatedAtText createdAt={panel.createdAt} />
      </View>
      </ScrollView>
    )
  }
};

export default withCurrentUser(InfoSinglePanel);
