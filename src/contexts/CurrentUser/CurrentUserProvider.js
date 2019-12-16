import React from 'react';

import { Platform, Alert } from 'react-native';

import { Auth } from 'aws-amplify';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateUser, deleteUser, createUser } from '../../graphql/mutations';
import { getUser } from '../../graphql/queries';

import { CurrentUserContext } from './CurrentUserContext';

import { withCurrentAuth } from '../CurrentAuth';

import aws_exports from '../../../src/aws-exports';

import { updateEndpoint } from '../../lib/pushNotification';

class CurrentUserProvider extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { currentUser, currentAuth } = this.props;
    if (currentUser && currentAuth) {
      if (!currentUser.identityId) {
        const currentCredentials = await Auth.currentCredentials();
        const input = {
          id: currentUser.id,
          expectedVersion: currentUser.version,
          identityId: currentCredentials.identityId,
        };
        this.props.updateUser({input});
      }
      await updateEndpoint(currentUser.id, aws_exports.aws_mobile_analytics_app_id);
    }
  }

  async componentWillReceiveProps(nextProps, nextState) {
    const { currentUser, currentAuth } = nextProps;
    if (this.props.currentUser && this.props.currentAuth) {
      return;
    }
    if (currentUser && currentAuth) {
      if (!currentUser.identityId) {
        const currentCredentials = await Auth.currentCredentials();
        const input = {
          id: currentUser.id,
          expectedVersion: currentUser.version,
          identityId: currentCredentials.identityId,
        };
        const offline = Object.assign(currentUser, {offline: true, updatedAt: (new Date()).toISOString()});
        this.props.updateUser({...offline, input});
      }
    }
  }

  render() {
    return (
      <CurrentUserContext.Provider value={{currentUser: this.props.currentUser}}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}

export default withCurrentAuth(compose(
  graphql(gql(getUser), {
    options: props => {
      const { username } = props.currentAuth || {};
      return ({
        fetchPolicy: 'cache-and-network',
        variables: { id: username }
      })
    },
    props: props => ({
      currentUser: props.data.getUser ? props.data.getUser : null,
    })
  }),
  graphqlMutation(gql(updateUser), gql(getUser), 'User'),
)(CurrentUserProvider));
