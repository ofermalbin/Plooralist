import React from 'react';
import { CurrentAuthContext } from './CurrentAuthContext';

export function withCurrentAuth(Component) {
  return function CurrentAuthComponent(props) {
    return (
      <CurrentAuthContext.Consumer>
        {(contexts) => <Component {...props} {...contexts} />}
      </CurrentAuthContext.Consumer>
    )
  }
}
