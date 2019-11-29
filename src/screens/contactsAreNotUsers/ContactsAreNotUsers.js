import React from 'react';
import { ScrollView, View, Text, SectionList } from 'react-native';
import { ListItem, Avatar, Divider } from 'react-native-elements';

import { graphql } from 'react-apollo';

import { filter, differenceWith, findIndex, forEach, groupBy, concat } from 'lodash';

import RowContactIsNotUser from './RowContactIsNotUser';

import { withCurrentUser, withContacts, withUsersAreContacts } from '../../contexts';

import { listStyles } from './config/stylesheets';

class ContactsAreNotUsers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const realContacts = filter(this.props.contacts, function(contact) {
      return contact.formattedPhoneNumbers.length && contact.givenName.length;
    })
    const inviteFriends = differenceWith(realContacts, concat(this.props.usersAreContacts, this.props.currentUser) , (realContact, user) => {
      return (
        findIndex(realContact.formattedPhoneNumbers, function(formattedPhoneNumber) { return formattedPhoneNumber === user.phoneNumber }) > -1
      );
    });
    let sections = [];
    forEach(groupBy(inviteFriends, (inviteFriend) => (inviteFriend.givenName[0])), (data) => {
      sections.push({title: data[0].givenName[0].toUpperCase(), data: data});
    });
    return (
      <SectionList
        sections={sections}
        renderItem={({ item }) => <RowContactIsNotUser {...item} navigation={this.props.navigation} />}
        keyExtractor={item => item.recordID}
        ItemSeparatorComponent={() => <Divider style={listStyles.separator} />}
        renderSectionHeader={({section}) => <Text style={listStyles.section}>{section.title}</Text>}
      />
    );
  }
}

export default withCurrentUser(withContacts(withUsersAreContacts(ContactsAreNotUsers)));
