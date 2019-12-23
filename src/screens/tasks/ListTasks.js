import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Divider } from 'react-native-elements';

import { orderBy } from 'lodash';

import { isPanelManager, isPanelBlock } from '../panels';

import RowTask from './RowTask';
import CreateTask from './CreateTask';

class ListTasks extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
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
    const isManager = isPanelManager(member);
    const isBlock = isPanelBlock(member);

    return (
      <FlatList
        ref={(ref) => { this.flatListRef = ref; }}
        data={orderBy(this.props.tasks, ['updatedAt'], ['desc'])}
        renderItem={({ item }) => <RowTask task={item} member={member} isPanelManager={isManager} isPanelBlock={isBlock} navigation={this.props.navigation} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
        ListHeaderComponent={isManager && this.renderHeader.bind(this)}
      />
    );
  }
}

export default ListTasks;
