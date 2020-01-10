import React from 'react';
import { Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { createCouplPanelsFromUsersAreContacts, listMembersForUser } from '../../graphql/queries';
import { onCreateStreamMember, onUpdateStreamMember, onDeleteStreamMember } from '../../graphql/subscriptions';

import { withCurrentUser, withUsersAreContacts } from '../../contexts';

import { Loading } from '../../components';

import ListPanels from './ListPanels';

import { listMembersForUserVariables } from './util';

import colors from '../../config/colors';

import translations from '../../translations'

class Panels extends React.Component {

  constructor(props) {
    super(props);

    props.navigation.setParams({onSelectPress: this.onSelectPress.bind(this)});
    this.streamMemberSubscribeToMore = this.streamMemberSubscribeToMore.bind(this);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.streamMemberSubscribeToMore(currentUser);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser } = nextProps;
    if (!this.props.currentUser && currentUser) {
      this.streamMemberSubscribeToMore(currentUser);
    }
  }

  streamMemberSubscribeToMore(currentUser) {
    this.props.membersData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateStreamMember), variables: {memberUserId: currentUser.id}},
        {query: gql(listMembersForUser), variables: listMembersForUserVariables(currentUser.id)}
      )
    );
    this.props.membersData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateStreamMember), variables: {memberUserId: currentUser.id}},
        {query: gql(listMembersForUser), variables: listMembersForUserVariables(currentUser.id)}
      )
    );
    this.props.membersData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteStreamMember), variables: {memberUserId: currentUser.id}},
        {query: gql(listMembersForUser), variables: listMembersForUserVariables(currentUser.id)}
      )
    );
  }

  onSelectPress() {
    this.props.navigation.navigate('SelectPanel');
  }

  render() {

    const { currentUser } = this.props;

    if (!currentUser) {
      return (
        <Loading />
      );
    }

    return (
      <ListPanels {...this.props} />
    );
  }
}

const enhance = withCurrentUser(withUsersAreContacts(compose(
  graphql(gql(listMembersForUser), {
    options: props => {
      const { currentUser } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: listMembersForUserVariables(currentUser ? currentUser.id : null)
      })
    },
    props: props => ({
      members: props.data.listMembersForUser ? props.data.listMembersForUser.items : [],
      membersData: props.data
    }),
  }),
  graphql(gql(createCouplPanelsFromUsersAreContacts), {
    options: props => {
      const { usersAreContacts } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {usersIds: usersAreContacts.map(user => user.id)}
      })
    },
  }),
) (Panels)));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: translations("General.plooralist"),
      headerLeft: () => <Button
        type="clear"
        icon={{
          name: 'search',
          color: colors.headerIcon,
        }}
        title=''
        onPress={() => navigation.navigate('Search')}
      />,
      headerRight: () => <Button
        type="clear"
        icon={{
          name: 'edit',
          color: colors.headerIcon,
        }}
        title=''
        onPress={() => params.onSelectPress()}
      />
    };
}

export default enhance;
