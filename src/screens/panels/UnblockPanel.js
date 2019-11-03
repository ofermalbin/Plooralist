import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import { graphqlMutation } from 'aws-appsync-react';

import { updateMyPanelBlock } from '../../graphql/mutations';
import { listMyPanels } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { isPanelBlock } from '../panels';

import { infoListStyles } from './config/stylesheets';

class UnblockPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onUnblockPress() {
    const { myPanel } = this.props;
    this.props.updateMyPanelBlock(Object.assign(myPanel, {block: false}, {updatedAt: (new Date()).toISOString()}));
  }

  render() {
    return (
      <ListItem
        containerStyle={[infoListStyles.container, { marginTop: 22 }]}
        titleStyle={[infoListStyles.title, infoListStyles.removeText]}
        title='Unblock'
        onPress={this.onUnblockPress.bind(this)}
      />
    )
  }
}

export default compose(
  graphqlMutation(updateMyPanelBlock, listMyPanels, 'MyPanel'),
)(UnblockPanel);
