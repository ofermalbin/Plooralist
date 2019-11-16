import React from 'react';

import { View, Text, FlatList } from 'react-native';

import { Button, Divider, normalize, colors } from "react-native-elements";

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembersForUser } from '../../../graphql/queries';
import { onCreateMember, onUpdateMember, onDeleteMember } from '../../../graphql/subscriptions';

import { titlePanelStyles } from '../config/stylesheets';

import TextMemberName from './TextMemberName';

class ListHorizontalMembersNames extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { memberPanelId } = this.props.member;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForUser), variables: {memberPanelId: memberPanelId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForUser), variables: {memberPanelId: memberPanelId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForUser), variables: {memberPanelId: memberPanelId}}
      )
    );
  }

  render() {
    const { member } = this.props;
    const members = member.panel.members.items;

    return (
      <FlatList
        data={members}
        renderItem={({ item }) => <View style={{flexDirection: 'row'}}><TextMemberName member={item} style={titlePanelStyles.memberNameText} /><Text style={titlePanelStyles.memberCommaText}>,</Text></View>}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    );
  }
}

export default ListHorizontalMembersNames;
