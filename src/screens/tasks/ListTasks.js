import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Divider } from 'react-native-elements';

import { orderBy } from 'lodash';

import { isPanelOwner, canAccessPanel, isPanelBlock } from '../panels';

import RowTask from './RowTask';
import CreateTask from './CreateTask';

class ListTasks extends React.Component {

  constructor(props) {
    super(props);
  }

  renderHeader() {
    const { member } = this.props;
    const isBlock = isPanelBlock(member);
    return (
      <CreateTask navigation={this.props.navigation} panelId={member.memberPanelId} isPanelBlock={isBlock} />
    )
  };

  render() {
    const { member } = this.props;
    const isOwner = isPanelOwner(member);
    const isBlock = isPanelBlock(member);
    const canAccess = canAccessPanel(member);
    return (
      <FlatList
        data={this.props.tasks}
        //data={orderBy(this.props.tasks, ['completed', 'updatedAt'], ['asc', 'desc'])}
        renderItem={({ item }) => <RowTask task={item} member={member} isPanelOwner={isOwner} isPanelBlock={isBlock} navigation={this.props.navigation} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
        ListHeaderComponent={canAccess && this.renderHeader.bind(this)}
      />
    );
  }
}

export default ListTasks;
