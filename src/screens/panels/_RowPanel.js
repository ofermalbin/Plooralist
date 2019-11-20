import React from 'react';

import { ListItem } from 'react-native-elements';

import { Storage } from 'aws-amplify';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateMember } from '../../graphql/mutations';
import { listMembersForUser } from '../../graphql/queries';

import { AvatarS3Image } from '../../components';

import { listStyles } from './config/stylesheets';

import { isPanelBlock, unblockBottomSheet } from '../panels';

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
    const { member, panel, name, imgKey } = this.props;

    const isBlock = isPanelBlock(member);

    return (
      <ListItem
        containerStyle={listStyles.container}
        titleStyle={listStyles.title}
        chevron={true}
        title={name}
        leftAvatar={
          <AvatarS3Image
            imgKey={imgKey}
            name={name}
            containerStyle={listStyles.avatarContainer}
            rounded={true}
          />
        }
        rightIcon={member.block && {name: 'block', iconStyle: [listStyles.rightIcon, {color: 'red'}]}}
        onPress={!isBlock ? this.onPress.bind(this) : () => unblockBottomSheet(this.onBlockPress.bind(this))}
        disabled={member.offline}
        disabledStyle={{opacity: 0.7}}
      />
    )
  }
};

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForUser), variables: {memberPanelId: variables.memberPanelId}}), 'Member'),
)(_RowPanel);
