import React from 'react';
import { View, Text, FlatList } from 'react-native';

import { Divider } from 'react-native-elements';

import { orderBy } from 'lodash';

import { isMemberManager, isMemberBlock, isOnlyManagersCreateTask } from '../panels';

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
    return (
      <CreateTask navigation={this.props.navigation} panelId={member.memberPanelId} />
    )
  };

  render() {
    const { member } = this.props;
    const panel = member.panel;

    return (
      <FlatList
        ref={(ref) => { this.flatListRef = ref; }}
        data={orderBy(this.props.tasks, ['updatedAt'], ['desc'])}
        renderItem={({ item }) => <RowTask task={item} member={member} isMemberManager={isMemberManager(member)} isMemberBlock={isMemberBlock(member)} navigation={this.props.navigation} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
        ListHeaderComponent={(!isOnlyManagersCreateTask(panel) || isMemberManager(member)) && this.renderHeader.bind(this)}
      />
    );
  }
}

export default ListTasks;
