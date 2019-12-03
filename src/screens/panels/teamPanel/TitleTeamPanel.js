import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembersForPanel } from '../../../graphql/queries';
import { onCreateMember, onUpdateMember, onDeleteMember } from '../../../graphql/subscriptions';

import { AvatarS3Image } from '../../../components';

import { titlePanelStyles } from '../config/stylesheets';

import { ListHorizontalMembersNames } from '../members'

class TitleTeamPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { memberPanelId } = this.props.member;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: {memberPanelId: memberPanelId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: {memberPanelId: memberPanelId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: {memberPanelId: memberPanelId}}
      )
    );
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

export default compose(
  graphql(gql(listMembersForPanel), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        memberPanelId: props.member.memberPanelId
      }
    }),
    props: props => ({
      members: props.data.listMembersForPanel ? props.data.listMembersForPanel.items : [],
      data: props.data
    }),
  }),
) (TitleTeamPanel);
