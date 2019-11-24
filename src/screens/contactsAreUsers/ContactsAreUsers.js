import React from 'react';
import { Text, SectionList, FlatList } from 'react-native';
import { ListItem, Avatar, Divider } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembersForUser } from '../../graphql/queries';
import { onCreateStreamMember, onUpdateStreamMember, onDeleteStreamMember } from '../../graphql/subscriptions';

import { find, forEach, groupBy, indexOf } from 'lodash';

import RowContactIsUser from './RowContactIsUser';
import RowPanel from '../panels/RowPanel';

import { getUserName } from '../../util';
import { withCurrentUser, withContacts, withUsersAreContacts } from '../../contexts';

import { listStyles } from './config/stylesheets';

class ContactsAreUsers extends React.Component {

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
    const { currentUser, contacts } = this.props;
    const coupleMembers = this.props.members.filter(member => member.panel && member.panel.type && member.panel.type === 2);

    const users = this.props.usersAreContacts.map(userIsContact => Object.assign({}, userIsContact, {name: getUserName(userIsContact, contacts), member: find(coupleMembers, coupleMember => coupleMember.panel && coupleMember.panel.members && coupleMember.panel.members.items && indexOf(coupleMember.panel.members.items.map(item => item.memberUserId), userIsContact.id) > -1)}));
    let sections = [];
    forEach(groupBy(users, (user) => (user.name[0])), (data) => {
      sections.push({title: data[0].name[0].toUpperCase(), data: data});
    });

    return (
      <SectionList
        sections={sections}
        renderItem={({ item }) => item.member ? <RowPanel member={item.member} navigation={this.props.navigation} /> : <RowContactIsUser user={item} navigation={this.props.navigation} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider style={listStyles.separator} />}
        renderSectionHeader={({section}) => <Text style={listStyles.section}>{section.title}</Text>}
      />
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
) (withContacts(withUsersAreContacts(ContactsAreUsers))));
