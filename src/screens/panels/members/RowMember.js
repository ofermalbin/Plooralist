import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listMembersForPanel } from '../../../graphql/queries';
import { updateMember, deleteMember } from '../../../graphql/mutations';

import Swipeout from 'react-native-swipeout';

import { each } from 'lodash';

import { withCurrentUser, withContacts } from '../../../contexts';

import colors from '../../../config/colors';

import { AvatarS3Image } from '../../../components';

import { getCurrentUserName, getUserName } from '../../../util';

import { rowPanelStyles } from '../config/stylesheets';

import { isPanelOwner, canAccessPanel, listMembersForPanelVariables } from '../util';

class RowMember extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    this.props.onPress && this.props.onPress(this.props.member);
  }

  onDeletePress(member) {
    const input = {
      id: member.id,
      expectedVersion: member.version,
    };
    const offline = Object.assign(member, {offline: true, updatedAt: (new Date()).toISOString()});
    this.props.deleteMember({...offline, input});
  }

  onCanAccessPress(member, canAccess) {
    const input = {
      id: member.id,
      expectedVersion: member.version,
      canAccess
    };
    const offline = Object.assign(member, {offline: true, canAccess, updatedAt: (new Date()).toISOString()});
    this.props.updateMember({...offline, input});
  }

  render() {
    const { member, myMember, contacts } = this.props;

    const isOwner = isPanelOwner(myMember);
    const canAccess = canAccessPanel(myMember);

    const isMemberOwner = isPanelOwner(member);
    const isMemberCanAccess = canAccessPanel(member);

    const leftBtns = [
      {
        text: isMemberCanAccess ? 'Remove Access' : 'Add Access',
        type: 'secondary',
        onPress: () => this.onCanAccessPress(member, !isMemberCanAccess)
      },
    ]

    const rightBtns = [
      {
        text: 'Delete',
        type: 'primary',
        backgroundColor: 'red',
        onPress: () => this.onDeletePress(member)
      }
    ]

    const name = (member.memberUserId === this.props.currentUser.id) ? getCurrentUserName() : getUserName(member.user, contacts);

    return (
      <Swipeout
        rowID={member.id}
        disabled={!canAccess || isMemberOwner}
        autoClose={true}
        close={!(this.props.selected === member.id)}
        onOpen={(sectionID, rowID) => this.props.onSelected(rowID)}
        backgroundColor='#FFFFFF'
        left={leftBtns}
        right={rightBtns}
        sensitivity={1}
      >
        <ListItem
          containerStyle={rowPanelStyles.container}
          titleStyle={rowPanelStyles.title}
          title={name}
          subtitle={(isMemberOwner && 'owner') || (isMemberCanAccess && 'can Access') || null}
          leftAvatar={
            <AvatarS3Image
              imgKey={member.user.imgKey}
              level='protected'
              identityId={member.user.identityId}
              name={name}
              size='medium'
              rounded={true}
            />
          }
          disabled={member.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
      </Swipeout>
    )
  }
};

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForPanel), variables: listMembersForPanelVariables(variables.memberPanelId)}), 'Member'),
  graphqlMutation(gql(deleteMember), variables => ({query: gql(listMembersForPanel), variables: listMembersForPanelVariables(variables.memberPanelId)}), 'Member')
)(withCurrentUser(withContacts(RowMember)));
