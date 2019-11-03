import _ from 'lodash';

export const getPhoneNubmersFromContacts = (contacts) => {
  return _.flatten(_.map(contacts, 'formattedPhoneNumbers'));
};

export const getContactByUsername = (contacts, phoneNumber) => {
  return _.find(contacts, function(contact) {
    return _.indexOf(contact.formattedPhoneNumbers, phoneNumber ) > -1;
  });
};

export const getContactName = contact => contact && `${contact.givenName || ''}${' '}${contact.familyName || ''}`;
