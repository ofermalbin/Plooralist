import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateMember } from '../../graphql/mutations';
import { listMembersForUser } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { includes } from 'lodash';

import { isPanelMute } from '../panels';

import { infoListStyles } from './config/stylesheets';

class MutePanel extends React.Component {

  constructor(props) {
    super(props);

    const { member } = props;
    const isMute = isPanelMute(member);

    this.state = {
      isMute: isMute,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { member } = nextProps;
    const isMute = isPanelMute(member);
    this.setState({
      isMute: isMute,
    })
  }

  onMutePress() {
    const { member } = this.props;
    const isMute = this.state.isMute;
    Alert.alert(
      isMute ? 'Unmute' : 'Mute',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          const input = {
            id: member.id,
            expectedVersion: member.version,
            mute: !isMute
          };
          const offline = Object.assign(member, {offline: true, mute: !isMute, updatedAt: (new Date()).toISOString()});
          this.props.updateMember({...offline, input});
        }}
      ]
    )
  }

  render() {
    const { member } = this.props;

    return (
      <ListItem
        containerStyle={[infoListStyles.container, { marginTop: 22 }]}
        titleStyle={infoListStyles.title}
        rightTitleStyle={infoListStyles.rightTitle}
        topDivider={true}
        bottomDivider={true}
        chevron={true}
        title={this.state.isMute ? 'Unmute' : 'Mute'}
        leftIcon={{name: this.state.isMute ? 'volume-off' : 'volume-up', iconStyle: infoListStyles.leftIcon}}
        rightTitle={this.state.isMute ? 'On' : 'Off'}
        onPress={this.onMutePress.bind(this)}
        disabled={member.offline}
        disabledStyle={{opacity: 0.7}}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForUser), variables: {memberUserId: variables.memberUserId}}), 'Member'),
)(MutePanel);
