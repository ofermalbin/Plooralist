import React from 'react';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-elements';
import { orderBy } from 'lodash';

import RowPanel from './RowPanel';

class ListPanels extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        data={orderBy(this.props.members, 'panel.updatedAt', 'desc')}
        renderItem={({ item }) => <RowPanel member={item} navigation={this.props.navigation} />}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider/>}
      />
    );
  }
}

export default ListPanels;
