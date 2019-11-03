import React from 'react';

import { FlatList } from 'react-native';

import { Divider } from "react-native-elements";

import { orderBy } from 'lodash';

import RowMember from './RowMember';

class ListMembers extends React.Component {

  constructor(props) {
    super(props);

    this.state =  {
      selected: null,
    }
  }

  onSelected(selected) {
    this.setState({selected});
  }

  render() {
    return (
      <FlatList
        data={orderBy(this.props.members, ['isOwner', 'canAccess', 'phoneNumber'], ['asc', 'asc', 'asc'])}
        renderItem={({ item }) => <RowMember member={item} myMember={this.props.member} selected={this.state.selected} onSelected={this.onSelected.bind(this)} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
      />
    );
  }
}

export default ListMembers;
