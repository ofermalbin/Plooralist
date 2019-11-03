import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

import Contacts from 'react-native-contacts';

import Radar from 'react-native-radar';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { withCurrentAuth } from '../CurrentAuth';

import { getPhoneNubmersFromContacts } from '../../util';

import { map, difference, uniq } from 'lodash';

import { ContactsContext } from './ContactsContext';

const getFormattedDeviceContacts = (contacts, country_code) => {
  return map(contacts, contact => {
    return Object.assign({}, contact, {
      formattedPhoneNumbers: map(map(contact.phoneNumbers, 'number'), phone_number => {
        if (phone_number.match(/^\+/)) {
          // remove any non-digit character
          return '+' + phone_number.replace(/\D/g, '');
        }
        else {
          // remove any non-digit character
          phone_number = phone_number.replace(/\D/g, '');
          // remove leading 0s for all countries except 'GAB', 'CIV', 'COG'
          if (['241', '225', '242'].indexOf(country_code) === -1) {
              phone_number = phone_number.replace(/^0+/, '');
          }
          return '+' + country_code + phone_number
        }
      })
    });
  });
};

const getContacts = () => {
  return new Promise((resolve, reject) => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        alert(JSON.stringify(err));
        reject(err);
      } else {
        resolve(contacts);
      }
    });
  });
}

const requestContactsPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'Plooralist would like to view your contacts.'
      }
    );
    return granted;
  } catch (err) {
    console.warn(err);
  }
};

class ContactsProvider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contacts: null,
      isAfterRequestContactsPermission: false
    }
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      try {
        const granted = await requestContactsPermission();
        this.setState({ isAfterRequestContactsPermission: true });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          try {
            const contacts = await getContacts();
            this.setState({ contacts });
          } catch(error) {
            console.error(error);
          }
        }
      } catch(error) {
        console.error(error);
      }
    }
    else {
      try {
        const contacts = await getContacts();
        this.setState({ isAfterRequestContactsPermission: true });
        this.setState({ contacts });
      } catch(error) {
        console.error(error);
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      (!this.state.isAfterRequestContactsPermission && nextState.isAfterRequestContactsPermission && this.props.currentAuth) ||
      (!this.props.currentAuth && nextProps.currentAuth && this.state.isAfterRequestContactsPermission)
    ) {
      const currentAuth = this.props.currentAuth || nextProps.currentAuth;
      Radar.setUserId(currentAuth.attributes.phone_number);
      Radar.setDescription(currentAuth.attributes.name);
      Radar.requestPermissions(true);
      Radar.trackOnce().then((result) => {
      }).catch((err) => {
        console.log('trackOnce ', err);
      });
      Radar.startTracking();
    }
  }

  render() {
    const { currentAuth } = this.props;
    let formattedDeviceContacts = null;
    let phoneNubmersFromContacts = null;
    const phoneNumber = currentAuth && parsePhoneNumberFromString(currentAuth.attributes.phone_number);
    if (currentAuth && phoneNumber && phoneNumber.countryCallingCode && this.state.contacts && this.state.contacts.length) {
      formattedDeviceContacts = getFormattedDeviceContacts(this.state.contacts, phoneNumber.countryCallingCode);
      phoneNubmersFromContacts = difference(uniq(getPhoneNubmersFromContacts(formattedDeviceContacts)), [currentAuth.attributes.phone_number]);
    }

    return (
      <ContactsContext.Provider value={{contacts: formattedDeviceContacts, phoneNubmersFromContacts: phoneNubmersFromContacts}}>
        {this.props.children}
      </ContactsContext.Provider>
    )
  }
}

export default withCurrentAuth(ContactsProvider)

/*
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  {
    'title': 'Contacts',
    'message': 'This app would like to view your contacts.'
  }
).then(() => {
  Contacts.getAll((err, contacts) => {
    if (err === 'denied'){
      // error
    } else {
      // contacts returned in Array
    }
  })
})
*/
