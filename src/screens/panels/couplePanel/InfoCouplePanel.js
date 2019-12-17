import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembersForPanel } from '../../../graphql/queries';
import { onCreateMember, onUpdateMember, onDeleteMember } from '../../../graphql/subscriptions';

import Loading from '../../../components/Loading';

import moment from 'moment/min/moment-with-locales.js';

import { AvatarS3Image } from '../../../components';

import { withContacts } from '../../../contexts';

import { find } from 'lodash';

import { getUserName } from '../../../util';

import { infoAvatarStyles, infoListStyles, createByAtStyles } from '../config/stylesheets';

import MutePanel from '../MutePanel';
import BlockPanel from '../BlockPanel';

import { listMembersForPanelVariables } from '../util';

class InfoCouplePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { memberPanelId } = this.props.member;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
  }

  render() {
    const { member, members, contacts } = this.props;
    const couple = find(members, couple => couple.memberUserId != member.memberUserId);

    const name = getUserName(couple.user, contacts);
    const imgKey = couple.user.imgKey;

    return (
      <ScrollView>
      <View>
        <AvatarS3Image
          imgKey={imgKey}
          name={name}
          level='protected'
          identityId={couple.user.identityId}
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
              level='protected'
              identityId={couple.user.identityId}
              size='medium'
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

export default compose(
  graphql(gql(listMembersForPanel), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: listMembersForPanelVariables(props.member.memberPanelId)
    }),
    props: props => ({
      members: props.data.listMembersForPanel ? props.data.listMembersForPanel.items : [],
      data: props.data
    }),
  }),
) (withContacts(InfoCouplePanel));
