import React from 'react';
import { View, StyleSheet } from 'react-native';

import { graphql } from 'react-apollo';

import { withUsersAreContacts } from '../../../contexts';

import _AddMembers from './_AddMembers';

import { Button } from "react-native-elements";

const styles = StyleSheet.create({
  divider: {
    height: 5,
  },
});

class CreateMembers extends React.Component {

  constructor(props) {
    super(props);
  }

  onNextPress(potentialsUsersChecked) {
    this.props.navigation.navigate('CreateTeamPanel', {users: potentialsUsersChecked});
  }

  onPotentialUserChecked(potentialsUsersChecked) {
    this.props.navigation.setParams({potentialsUsersChecked: potentialsUsersChecked.length ? true : false, onNextPress: this.onNextPress.bind(this, potentialsUsersChecked)});
  }

  render() {
    return (
      <_AddMembers navigation={this.props.navigation} potentialsUsers={this.props.usersAreContacts} onPotentialUserChecked={this.onPotentialUserChecked.bind(this)} />
    );
  }
}

const enhance = withUsersAreContacts(CreateMembers);

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "New Team",
      headerRight: () => <Button type="clear" title="Next" titleStyle={{color: '#5fb8f6'}} disabled={!params.potentialsUsersChecked} onPress={() => params.onNextPress()} />,
      headerLeft: () => <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
