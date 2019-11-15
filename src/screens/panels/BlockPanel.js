import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateMember } from '../../graphql/mutations';
import { listMembersForUser } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { includes } from 'lodash';

import { isPanelBlock } from '../panels';

import { infoListStyles } from './config/stylesheets';

class BlockPanel extends React.Component {

  constructor(props) {
    super(props);

    const { member } = props;
    const isBlock = isPanelBlock(member);

    this.state = {
      isBlock: isBlock,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { member } = nextProps;
    const isBlock = isPanelBlock(member);
    this.setState({
      isBlock: isBlock,
    })
  }

  onBlockPress() {
    const { member } = this.props;
    const isBlock = this.state.isBlock;
    Alert.alert(
      isBlock ? 'Unblock' : 'Block',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
            const input = {
              id: member.id,
              expectedVersion: member.version,
              block: !isBlock
            };
            const offline = Object.assign(member, {offline: true, block: !isBlock, updatedAt: (new Date()).toISOString()});
            this.props.updateMember({...offline, input});
            this.props.navigation.popToTop();
        }}
      ]
    )
  }

  render() {
    return (
      <ListItem
        containerStyle={[infoListStyles.container, { marginTop: 22 }]}
        titleStyle={[infoListStyles.title, infoListStyles.removeText]}
        topDivider={true}
        bottomDivider={true}
        chevron={false}
        title={this.state.isBlock ? 'Unblock' : 'Block'}
        onPress={this.onBlockPress.bind(this)}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForUser), variables: {memberPanelId: variables.memberPanelId }}), 'Member'),
)(BlockPanel);
