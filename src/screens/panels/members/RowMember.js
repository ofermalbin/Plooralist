import React from 'react';
import { Alert } from 'react-native';

import { ListItem } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listMembersForPanel } from '../../../graphql/queries';
import { updateMember, deleteMember } from '../../../graphql/mutations';

import { connectActionSheet } from '@expo/react-native-action-sheet';

import { each } from 'lodash';

import { withCurrentUser, withContacts } from '../../../contexts';

import colors from '../../../config/colors';

import { AvatarS3Image } from '../../../components';

import { getCurrentUserName, getUserName } from '../../../util';

import { rowPanelStyles } from '../config/stylesheets';

import { isMemberManager, listMembersForPanelVariables } from '../util';

class RowMember extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    this.props.onPress && this.props.onPress(this.props.member);
  }

  onDeletePress() {
    const { member } = this.props;

    const input = {
      id: member.id,
      expectedVersion: member.version,
    };
    const offline = Object.assign(member, {offline: true, updatedAt: (new Date()).toISOString()});
    this.props.deleteMember({...offline, input});
  }

  onManagerPress() {
    const { member } = this.props;

    const manager = !isMemberManager(member);

    const input = {
      id: member.id,
      expectedVersion: member.version,
      manager
    };
    const offline = Object.assign(member, {offline: true, manager, updatedAt: (new Date()).toISOString()});
    this.props.updateMember({...offline, input});
  }

  onActionPress() {
    const { member, myMember, contacts } = this.props;

    const options = ['Delete', isMemberManager(member) ? 'Dismiss manager' : 'Make manager', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    if (member.id === myMember.id) {
      return;
    }

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0: this.onDeletePress.bind(this)();
                  break;
          case 1: this.onManagerPress.bind(this)();
                  break;
          default: ;
                  break;
        }
      },
    );
  };

  render() {
    const { member, myMember, contacts } = this.props;
    const name = (member.memberUserId === this.props.currentUser.id) ? getCurrentUserName() : getUserName(member.user, contacts);

    return (
      <ListItem
        containerStyle={rowPanelStyles.container}
        titleStyle={rowPanelStyles.title}
        title={name}
        subtitle={(isMemberManager(member) && 'manager') || null}
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
        onPress={isMemberManager(myMember) ? this.onActionPress.bind(this) : null}
        disabled={member.offline}
        disabledStyle={{backgroundColor: '#F0F8FF'}}
      />
    )
  }
};

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForPanel), variables: listMembersForPanelVariables(variables.memberPanelId)}), 'Member'),
  graphqlMutation(gql(deleteMember), variables => ({query: gql(listMembersForPanel), variables: listMembersForPanelVariables(variables.memberPanelId)}), 'Member')
)(withCurrentUser(withContacts(connectActionSheet(RowMember))));
