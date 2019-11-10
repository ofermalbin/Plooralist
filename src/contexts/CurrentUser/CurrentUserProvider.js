import React from 'react';

import { Platform, Alert } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { getCurrentUser, listUsers } from '../../graphql/queries';

import { CurrentUserContext } from './CurrentUserContext';

import aws_exports from '../../../src/aws-exports';

import { updateEndpoint } from '../../lib/pushNotification';

class CurrentUserProvider extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { currentUser } = this.props;
    currentUser && await updateEndpoint(currentUser.id, aws_exports.aws_mobile_analytics_app_id);
  }

  async componentWillReceiveProps(nextProps, nextState) {
    const { currentUser } = nextProps;
    if (this.props.currentUser) {
      return;
    }
    currentUser && await updateEndpoint(currentUser.id, aws_exports.aws_mobile_analytics_app_id);
  }

  render() {
    return (
      <CurrentUserContext.Provider value={{currentUser: this.props.currentUser}}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}

export default compose(
  graphql(gql(getCurrentUser), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      currentUser: props.data.getCurrentUser ? props.data.getCurrentUser : null,
    })
  })
)(CurrentUserProvider);
