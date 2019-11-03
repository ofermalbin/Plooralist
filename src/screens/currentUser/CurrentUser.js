import React from 'react';
import { FlatList } from 'react-native';
import { ListItem, Avatar, Divider } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { listMembers } from '../../graphql/queries';

import { find } from 'lodash';

import { withCurrentUser } from '../../contexts';

import RowCurrentUser from './RowCurrentUser';
import RowPanel from '../panels/RowPanel';

class CurrentUser extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const member = this.props.members.find(member => member.panel.type === 1);

    return (
      member ? <RowPanel member={member} navigation={this.props.navigation} /> : <RowCurrentUser navigation={this.props.navigation} />
    );
  }
}

export default withCurrentUser(compose(
  graphql(gql(listMembers), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        filter: { memberUserId: { eq: props.currentUser ? props.currentUser.id : null } }
      }
    }),
    props: props => ({
      members: props.data.listMembers ? props.data.listMembers.items : [],
      data: props.data
    }),
  }),
) (CurrentUser));
