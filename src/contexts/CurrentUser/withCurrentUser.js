import React from 'react';
import { CurrentUserContext } from './CurrentUserContext';

export function withCurrentUser(Component) {
  return function CurrentUserComponent(props) {
    return (
      <CurrentUserContext.Consumer>
        {(contexts) => <Component {...props} {...contexts} />}
      </CurrentUserContext.Consumer>
    )
  }
}
