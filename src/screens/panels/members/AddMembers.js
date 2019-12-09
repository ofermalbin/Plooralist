import React from 'react';
import { View } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { withUsersAreContacts } from '../../../contexts';

import { listMembersForPanel } from '../../../graphql/queries';
import { createMember } from '../../../graphql/mutations';

import _AddMembers from './_AddMembers';

import { Button } from "react-native-elements";

import { differenceWith } from 'lodash';

import { listMembersForPanelVariables } from '../util';

class AddMembers extends React.Component {

  constructor(props) {
    super(props);
  }

  onAddPress(potentialsUsersChecked) {
    const { panelId } = this.props.navigation.state.params;

    const input = {
      memberPanelId: panelId,
      memberUserId: null,
      canAccess: true,
    };

    const now = new Date();
    const offline = {
      offline: true,
      version: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      memberPanelId: panelId,
      memberUserId: null,
      coupleUserId: null,
      user: null,
      isOwner: false,
      canAccess: true,
      block: false,
      mute: false,
      pin: false,
      panel: {
        __typename: 'Panel',
        id: null,
        offline: true,
        version: null,
        type: 3,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        name: null,
        imgKey: null,
      }
    };

    potentialsUsersChecked.map((potentialUser) => this.props.createMember({...Object.assign(offline, {memberUserId: potentialUser.id}, {user: potentialUser}), input: Object.assign(input, {memberUserId: potentialUser.id})}));
    this.props.navigation.goBack();
  }

  onPotentialUserChecked(potentialsUsersChecked) {
    this.props.navigation.setParams({potentialsUsersChecked: potentialsUsersChecked.length ? true : false, onAddPress: this.onAddPress.bind(this, potentialsUsersChecked)});
  }

  render() {
    const { members } = this.props.navigation.state.params;
    const potentialsUsers = differenceWith(this.props.usersAreContacts, members, (userIsContact, member) => (userIsContact.id === member.memberUserId));
    return (
      <_AddMembers navigation={this.props.navigation} potentialsUsers={potentialsUsers} onPotentialUserChecked={this.onPotentialUserChecked.bind(this)} />
    );
  }
}

const enhance = compose(
  graphqlMutation(gql(createMember), variables => ({query: gql(listMembersForPanel), variables: listMembersForPanelVariables(variables.memberPanelId)}), 'Member'),
)(withUsersAreContacts(AddMembers));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Add Members",
      headerRight: <Button type="clear" title="Add" titleStyle={{color: '#5fb8f6'}} disabled={!params.potentialsUsersChecked} onPress={() => params.onAddPress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
