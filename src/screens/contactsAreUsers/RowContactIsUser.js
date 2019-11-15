import React from 'react';

import { ListItem } from 'react-native-elements';

import { AvatarS3Image } from '../../components';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listMembersForUser } from '../../graphql/queries';
import { createPanelAndMembers } from '../../graphql/mutations';

import { withCurrentUser } from '../../contexts';

import { listStyles } from './config/stylesheets';

class RowContactIsUser extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    const { currentUser, user } = this.props;

    const input = {
      type: 2,
      ownersIds: [currentUser.id, user.id],
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
        type: 2,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        name: null,
        imgKey: null,
        members: {
          __typename: 'Members',
          items: [
            {
              __typename: 'Member',
              id: null,
              offline: true,
              version: null,
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              memberPanelId: null,
              memberUserId: user.id,
              user: user,
              panel: {
                __typename: 'Panel',
                id: null,
                offline: true,
                version: null,
                type: 2,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                name: null,
                imgKey: null,
                members: {
                  __typename: 'Members',
                  nextToken: null
                }
              },
              isOwner: true,
              canAccess: true,
              block: false,
              mute: false,
              pin: false,
            },
            {
              __typename: 'Member',
              id: null,
              offline: true,
              version: null,
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              memberPanelId: null,
              memberUserId: currentUser.id,
              user: currentUser,
              panel: {
                __typename: 'Panel',
                id: null,
                offline: true,
                version: null,
                type: 2,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                name: null,
                imgKey: null,
                members: {
                  __typename: 'Members',
                  nextToken: null
                }
              },
              isOwner: true,
              canAccess: true,
              block: false,
              mute: false,
              pin: false,
            },
          ],
          nextToken: null
        }
      }
    };
    this.props.createPanelAndMembers({...offline, ...input});
    this.props.navigation.goBack();
  }

  render() {
    const { user } = this.props;

    return (
      <ListItem
        containerStyle={listStyles.container}
        titleStyle={listStyles.title}
        chevron={true}
        title={user.name}
        subtitle='no member'
        leftAvatar={<AvatarS3Image name={user.name} imgKey={user.imgKey} containerStyle={listStyles.avatarContainer} rounded={true} />}
        onPress={this.onPress.bind(this)} />
    )
  }
};

export default compose(
  graphqlMutation(gql(createPanelAndMembers), variables => ({query: gql(listMembersForUser), variables: {memberUserId: variables.memberUserId }}), 'Member'),
) (withCurrentUser(RowContactIsUser))
