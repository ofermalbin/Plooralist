import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { Button, Icon, Divider } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { createCouplPanelsFromUsersAreContacts, listMembersForUser } from '../../graphql/queries';
import { onCreateStreamMember, onUpdateStreamMember, onDeleteStreamMember } from '../../graphql/subscriptions';

import { withCurrentUser, withUsersAreContacts } from '../../contexts';

import Loading from '../../components/Loading';

import ListPanels from './ListPanels';

import colors from '../../config/colors';

class Panels extends React.Component {

  constructor(props) {
    super(props);

    props.navigation.setParams({onSelectPress: this.onSelectPress.bind(this)});
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.props.membersData.subscribeToMore(
        buildSubscription(
          {query: gql(onCreateStreamMember), variables: {memberUserId: currentUser.id}},
          {query: gql(listMembersForUser), variables: {memberUserId: currentUser.id}}
        )
      );
      this.props.membersData.subscribeToMore(
        buildSubscription(
          {query: gql(onUpdateStreamMember), variables: {memberUserId: currentUser.id}},
          {query: gql(listMembersForUser), variables: {memberUserId: currentUser.id}}
        )
      );
      this.props.membersData.subscribeToMore(
        buildSubscription(
          {query: gql(onDeleteStreamMember), variables: {memberUserId: currentUser.id}},
          {query: gql(listMembersForUser), variables: {memberUserId: currentUser.id}}
        )
      );
    }
  }

  onSelectPress() {
    this.props.navigation.navigate('SelectPanel');
  }

  render() {

    const { currentUser } = this.props;

    if (!currentUser) {
      return (
        <Loading />
      );
    }

    return (
      <ListPanels {...this.props} />
    );
  }
}

const enhance = withCurrentUser(withUsersAreContacts(compose(
  graphql(gql(listMembersForUser), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        memberUserId: props.currentUser ? props.currentUser.id : null, sortDirection: "DESC", limit: 100
      }
    }),
    props: props => ({
      members: props.data.listMembersForUser ? props.data.listMembersForUser.items : [],
      membersData: props.data
    }),
  }),
  graphql(gql(createCouplPanelsFromUsersAreContacts), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        usersIds: props.usersAreContacts ? props.usersAreContacts.map(user => user.id) : null
      }
    }),
  }),
) (Panels)));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Plooralist",
      headerLeft: <Button
        type="clear"
        icon={{
          name: 'search',
          color: colors.headerIcon,
        }}
        title=''
        onPress={() => navigation.navigate('Search')}
      />,
      headerRight: <Button
        type="clear"
        icon={{
          name: 'edit',
          color: colors.headerIcon,
        }}
        title=''
        onPress={() => params.onSelectPress()}
      />
    };
}

export default enhance;
