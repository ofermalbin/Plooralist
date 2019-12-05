import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Button, Icon, Divider } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { listMembersForUser } from '../../../graphql/queries';
import { onCreateStreamMember, onUpdateStreamMember, onDeleteStreamMember } from '../../../graphql/subscriptions';

import { withCurrentUser } from '../../../contexts';

import Loading from '../../../components/Loading';

import ListPanels from '../ListPanels';

class CouplesPanels extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.props.data.subscribeToMore(
        buildSubscription(
          {query: gql(onCreateStreamMember), variables: {memberUserId: currentUser.id}},
          {query: gql(listMembersForUser), variables: {memberUserId: currentUser.id}}
        )
      );
      this.props.data.subscribeToMore(
        buildSubscription(
          {query: gql(onUpdateStreamMember), variables: {memberUserId: currentUser.id}},
          {query: gql(listMembersForUser), variables: {memberUserId: currentUser.id}}
        )
      );
      this.props.data.subscribeToMore(
        buildSubscription(
          {query: gql(onDeleteStreamMember), variables: {memberUserId: currentUser.id}},
          {query: gql(listMembersForUser), variables: {memberUserId: currentUser.id}}
        )
      );
    }
  }

  render() {

    const { currentUser, members } = this.props;

    if (!currentUser) {
      return (
        <Loading />
      );
    }

    const coupleMembers = members.filter(member => member.panel && member.panel.type && member.panel.type === 2);
    return (
      <ListPanels navigation={this.props.navigation} members={coupleMembers} />
    );
  }
}

export default withCurrentUser(compose(
  graphql(gql(listMembersForUser), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        memberUserId: props.currentUser ? props.currentUser.id : null, sortDirection: "DESC", limit: 100
      }
    }),
    props: props => ({
      members: props.data.listMembersForUser ? props.data.listMembersForUser.items : [],
      data: props.data
    }),
  }),
) (CouplesPanels));