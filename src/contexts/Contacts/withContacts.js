import React from 'react';
import { ContactsContext } from './ContactsContext';

export function withContacts(Component) {
  return function ContactsComponent(props) {
    return (
      <ContactsContext.Consumer>
        {(contexts) => <Component {...props} {...contexts} />}
      </ContactsContext.Consumer>
    )
  }
}
