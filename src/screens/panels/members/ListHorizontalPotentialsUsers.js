import React from 'react';

import { FlatList } from 'react-native';

import { Button, Divider } from "react-native-elements";

import RowHorizontalPotentialUser from './RowHorizontalPotentialUser';

class ListHorizontalPotentialsUsers extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        data={this.props.potentialsUsersChecked}
        renderItem={({ item }) => <RowHorizontalPotentialUser user={item} onDeleteAvatarPress={() => this.props.onPotentialUserChecked(item, false)} />}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    );
  }
}

export default ListHorizontalPotentialsUsers;
