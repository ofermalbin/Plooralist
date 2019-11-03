import React from 'react';

import { View, FlatList } from 'react-native';

import { Divider } from "react-native-elements";

import RowPotentialUser from './RowPotentialUser';

import { findIndex } from 'lodash';

class ListPotentialsUsers extends React.Component {

  constructor(props) {
    super(props);

    this.state =  {
      data: props.potentialsUsers,
      potentialsUsersChecked: props.potentialsUsersChecked,
      panelId: props.panelId && props.panelId,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.potentialsUsers,
      potentialsUsersChecked: nextProps.potentialsUsersChecked,
      panelId: nextProps.panelId && nextProps.panelId
    })
  }

  componentDidMount() {
    if (!this.props.potentialsUsers || !this.props.potentialsUsers.length) {
      this.props.navigation.goBack(null);
    }
  }

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => <RowPotentialUser user={item} checked={findIndex(this.state.potentialsUsersChecked, potentialUser => potentialUser.id == item.id) > -1} onPotentialUserChecked={this.props.onPotentialUserChecked} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
      />
    );
  }
}

export default ListPotentialsUsers;
