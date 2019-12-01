import React from 'react';

import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listMembersForUser } from '../../graphql/queries';
import { createPanelAndMembers } from '../../graphql/mutations';

import uuid from 'react-native-uuid';

import { withCurrentUser } from '../../contexts';

import { AvatarS3Image } from '../../components';

import { getCurrentUserName } from '../../util';

import { rowCurrentUserStyles } from './config/stylesheets';

class RowCurrentUser extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    const { currentUser } = this.props;
    const input = {
      id: uuid.v4(),
      type: 1,
      ownersIds: [currentUser.id],
      canAccessIds: [],
      membersIds: []
    };
    const now = new Date();
    const offline = {
      offline: true,
      version: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      memberPanelId: null,
      memberUserId: currentUser.id,
      user: {
        __typename: 'User',
        id: currentUser.id,
        offline: true,
        version: null,
        phoneNumber: currentUser.phoneNumber,
        createdAt: null,
        updatedAt: null,
        name: null,
        email: null,
        locale: null,
        imgKey: null,

      },
      isOwner: true,
      canAccess: true,
      block: false,
      mute: false,
      pin: false,
      panel: {
        __typename: 'Panel',
        id: null,
        offline: true,
        version: null,
        type: 1,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        name: null,
        imgKey: null,
        members: {
          __typename: 'Members',
          items: null,
          nextToken: null
        }
      }
    };
    this.props.createPanelAndMembers({...offline, ...input});
    this.props.navigation.goBack();
  }

  render() {
    const { imgKey } = this.props.currentUser;
    const name = getCurrentUserName();
    return (
      <ListItem
        containerStyle={rowCurrentUserStyles.container}
        titleStyle={rowCurrentUserStyles.title}
        chevron={true}
        title={name}
        subtitle='new'
        leftAvatar={<AvatarS3Image name={name} imgKey={imgKey} containerStyle={rowCurrentUserStyles.avatarContainer} rounded={true} />}
        onPress={this.onPress.bind(this)} />
    )
  }
};

export default compose(
  graphqlMutation(gql(createPanelAndMembers), variables => ({query: gql(listMembersForUser), variables: {memberUserId: variables.memberUserId, sortDirection: "DESC", limit: 100}}), 'Member'),
) (withCurrentUser(RowCurrentUser))
