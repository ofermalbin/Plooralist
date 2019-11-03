import React from 'react';

import deepEqual from 'deep-equal';

import { difference, chunk, concat, times, compact, slice } from 'lodash';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { listUsersAreContacts } from '../../graphql/queries';

import { UsersAreContactsContext } from './UsersAreContactsContext';

import { withContacts } from '../Contacts';

class UsersAreContactsProvider extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <UsersAreContactsContext.Provider value={{usersAreContacts: this.props.usersAreContacts}}>
        {this.props.children}
      </UsersAreContactsContext.Provider>
    )
  }
}

export default withContacts(
  graphql(gql(listUsersAreContacts), {
      options: props => {
        return ({
          fetchPolicy: 'cache-and-network',
          variables: {
            contacts: props.phoneNubmersFromContacts || []
          }
        })
      },
      props: props => ({
        usersAreContacts: props.data.listUsersAreContacts ? props.data.listUsersAreContacts : [],
      })
  })(UsersAreContactsProvider));
