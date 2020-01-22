import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateMember } from '../../graphql/mutations';
import { listMembersForUser } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { includes } from 'lodash';

import { isMemberMute, listMembersForUserVariables } from './util';

import { Chevron } from '../../components';

import translate from '../../translations';

import { infoListStyles } from './config/stylesheets';

class MutePanel extends React.Component {

  constructor(props) {
    super(props);

    const { member } = props;
    const isMute = isMemberMute(member);

    this.state = {
      isMute: isMute,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { member } = nextProps;
    const isMute = isMemberMute(member);
    this.setState({
      isMute: isMute,
    })
  }

  onMutePress() {
    const { member } = this.props;
    const isMute = this.state.isMute;
    Alert.alert(
      translate(isMute ? "Panel.cancel mute" : "Panel.mute"),
      translate("Common.Alert.are you sure?"),
      [
        {text: translate("Common.Button.cancel")},
        {text: translate("Common.Button.ok"), onPress: () => {
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
        chevron={<Chevron />}
        title={translate(this.state.isMute ? "Panel.unmute" : "Panel.mute")}
        leftIcon={{name: this.state.isMute ? 'volume-off' : 'volume-up', iconStyle: infoListStyles.leftIcon}}
        rightTitle={translate(this.state.isMute ? "Common.Status.yes" : "Common.Status.no")}
        onPress={this.onMutePress.bind(this)}
        disabled={member.offline}
        disabledStyle={{backgroundColor: '#F0F8FF'}}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(updateMember), variables => ({query: gql(listMembersForUser), variables: listMembersForUserVariables(variables.memberUserId)}), 'Member'),
)(MutePanel);
