import React from 'react';

import { ListItem } from 'react-native-elements';

import { Storage } from 'aws-amplify';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateMember } from '../../graphql/mutations';
import { listMembersForUser } from '../../graphql/queries';

import { AvatarS3Image, Chevron } from '../../components';

import { rowPanelStyles } from './config/stylesheets';

import { isMemberBlock, unblockBottomSheet, listMembersForUserVariables } from './util';

import BottomSheet from 'react-native-bottomsheet';

class _RowPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    const { member } = this.props;
    this.props.navigation.navigate('Tasks', { memberId: member.id, panelId: member.memberPanelId});
  }

  onBlockPress() {
    const { member } = this.props;
    const input = {
      id: member.id,
      expectedVersion: member.version,
      block: false
    };
    const offline = Object.assign(member, {offline: true, block: false, updatedAt: (new Date()).toISOString()});
    this.props.updateMember({...offline, input});
  }

  render() {
    const { member, panel, name, imgKey, level, identityId } = this.props;

    const isBlock = isMemberBlock(member);

    return (
      <ListItem
        containerStyle={rowPanelStyles.container}
        titleStyle={rowPanelStyles.title}
        chevron={<Chevron />}
        title={name}
        leftAvatar={
          <AvatarS3Image
            imgKey={imgKey}
            level={level}
            identityId={identityId}
            name={name}
            size='medium'
            rounded={true}
          />
        }
        rightIcon={member.block && {name: 'block', iconStyle: [rowPanelStyles.rightIcon, {color: 'red'}]}}
        onPress={!isBlock ? this.onPress.bind(this) : () => unblockBottomSheet(this.onBlockPress.bind(this))}
        disabled={member.offline}
        disabledStyle={{backgroundColor: '#F0F8FF'}}
      />
    )
  }
};

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForUser), variables: listMembersForUserVariables(variables.memberUserId)}), 'Member'),
)(_RowPanel);
