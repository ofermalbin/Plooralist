import { find } from 'lodash';
import { getContactByUsername, getContactName } from './';

const __capitalize_Words = function(str) {
  return str && str.replace (/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

export const getCurrentUserName = () => {
  return 'Me';
}

export const getUserName = (user, contacts) => {
  const contact = getContactByUsername(contacts, user.phoneNumber);
  return __capitalize_Words(contact ? getContactName(contact) : user.name);
};
