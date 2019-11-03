import React from 'react';
import { View, StyleSheet } from 'react-native';

import ListPotentialsUsers from './ListPotentialsUsers';
import ListHorizontalPotentialsUsers from './ListHorizontalPotentialsUsers';

import { Divider } from "react-native-elements";

const styles = StyleSheet.create({
  divider: {
    height: 5,
  },
});

import { cloneDeep, findIndex } from 'lodash';

class _AddMembers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      potentialsUsersChecked: [],
    };
  }

  onPotentialUserChecked(user, checked) {
    let potentialsUsersChecked = cloneDeep(this.state.potentialsUsersChecked);
    if (checked) {
      potentialsUsersChecked.push(user);
    }
    else {
      const pos = findIndex(potentialsUsersChecked, potentialUser => potentialUser.id == user.id);
      (pos > -1) && potentialsUsersChecked.splice(pos, 1);
    }
    this.setState({potentialsUsersChecked: potentialsUsersChecked});
    this.props.onPotentialUserChecked && this.props.onPotentialUserChecked(potentialsUsersChecked);
  }

  render() {
    const { potentialsUsers } = this.props;
    return (
      <View>
        {(this.state.potentialsUsersChecked.length || null) && <ListHorizontalPotentialsUsers potentialsUsersChecked={this.state.potentialsUsersChecked} onPotentialUserChecked={this.onPotentialUserChecked.bind(this)} />}
        {(this.state.potentialsUsersChecked.length || null) && <Divider style={styles.divider} />}
        <ListPotentialsUsers navigation={this.props.navigation} potentialsUsers={potentialsUsers} potentialsUsersChecked={this.state.potentialsUsersChecked} onPotentialUserChecked={this.onPotentialUserChecked.bind(this)} />
      </View>
    );
  }
}

export default _AddMembers;
