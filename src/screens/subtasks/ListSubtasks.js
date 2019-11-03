import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Divider } from 'react-native-elements';

import { orderBy } from 'lodash';

import RowSubtask from './RowSubtask';
import CreateSubtask from './CreateSubtask';

class ListSubtasks extends React.Component {

  constructor(props) {
    super(props);

    this.state =  {
      selected: null,
    }
  }

  onSelected(selected) {
    this.setState({selected});
  }

  renderHeader() {
    const { task, isTaskOwner } = this.props;

    return (
      <CreateSubtask navigation={this.props.navigation} taskId={task.id} />
    )
  };

  render() {
    const { isTaskOwner } = this.props;
    return (
      <FlatList
        data={orderBy(this.props.subtasks, 'updatedAt', 'desc')}
        renderItem={({ item }) => <RowSubtask subtask={item} isTaskOwner={isTaskOwner} navigation={this.props.navigation} selected={this.state.selected} onSelected={this.onSelected.bind(this)} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
        ListHeaderComponent={isTaskOwner && this.renderHeader.bind(this)}
      />
    );
  }
}

export default ListSubtasks;
