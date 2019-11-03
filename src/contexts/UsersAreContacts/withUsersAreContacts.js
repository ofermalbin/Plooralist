import React from 'react';
import { UsersAreContactsContext } from './UsersAreContactsContext';

export function withUsersAreContacts(Component) {
  return function UsersAreContactsComponent(props) {
    return (
      <UsersAreContactsContext.Consumer>
        {(contexts) => <Component {...props} {...contexts} />}
      </UsersAreContactsContext.Consumer>
    )
  }
}
