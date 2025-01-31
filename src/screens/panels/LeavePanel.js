import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { deleteMember } from '../../graphql/mutations';
import { listMembersForUser } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { listMembersForPanelVariables } from './util';

import translate from '../../translations';

import { infoListStyles } from './config/stylesheets';

class LeavePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onLeavePress() {
    const { member } = this.props;
    Alert.alert(
      'Leave',
      translate("Common.Alert.are you sure?"),
      [
        {text: translate("Common.Button.cancel")},
        {text: translate("Common.Button.ok"), onPress: () => {
          const input = {
            id: member.id,
            expectedVersion: member.version,
          };
          const offline = Object.assign(member, {offline: true, updatedAt: (new Date()).toISOString()});
          this.props.deleteMember({...offline, input});
          this.props.navigation.popToTop();
        }},
      ]
    )
  }

  render() {
    return (
      <ListItem
        topDivider={true}
        bottomDivider={true}
        containerStyle={[infoListStyles.container, {marginTop:22}]}
        titleStyle={[infoListStyles.title, infoListStyles.removeText]}
        title={translate("Panel.leave team")}
        onPress={this.onLeavePress.bind(this)}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(deleteMember), variables => ({query: gql(listMembersForUser), variables: listMembersForPanelVariables(variables.memberPanelId)}), 'Member')
)(LeavePanel);
