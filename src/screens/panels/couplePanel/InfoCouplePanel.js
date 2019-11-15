import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

import Loading from '../../../components/Loading';

import moment from 'moment/min/moment-with-locales.js';

import { AvatarS3Image } from '../../../components';

import { withContacts } from '../../../contexts';

import { find } from 'lodash';

import { getUserName } from '../../../util';

import { infoAvatarStyles, infoListStyles, createByAtStyles } from '../config/stylesheets';

import MutePanel from '../MutePanel';
import BlockPanel from '../BlockPanel';

class InfoCouplePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, contacts } = this.props;
    const couple = find(member.panel.members.items, couple => couple.memberUserId != member.memberUserId);

    const name = getUserName(couple.user, contacts);
    const imgKey = couple.user.imgKey;

    return (
      <ScrollView>
      <View>
        <AvatarS3Image
          imgKey={imgKey}
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
              name={name}
              containerStyle={infoListStyles.avatarContainer}
              rounded={true}
            />
          }
        />
        <MutePanel {...this.props} />
        <BlockPanel {...this.props} />
        <View style={createByAtStyles.container}>
          <Text style={createByAtStyles.text}>{`${'created at '}${moment(member.panel.createdAt).locale('en').format('LL')}.`}</Text>
        </View>
      </View>
      </ScrollView>
    )
  }
};

export default withContacts(InfoCouplePanel);
