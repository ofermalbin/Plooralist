import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { getPanel } from '../../graphql/queries';
import { deletePanel } from '../../graphql/mutations';

import { ListItem } from 'react-native-elements';

import translations from '../../translations';

import { infoListStyles } from './config/stylesheets';

class DeletePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onDeletePress() {
    Alert.alert(
      'Delete',
      translations("Common.Alert.are you sure?"),
      [
        {text: translations("Common.Button.cancel")},
        {text: translations("Common.Button.ok"), onPress: () => {
          const { member } = this.props;
          const input = {
            id: member.panel.id,
            expectedVersion: member.panel.version,
          };
          const offline = Object.assign(member.panel, {offline: true});
          this.props.deletePanel({...offline, input});
          this.props.navigation.popToTop();
        }},
      ]
    )
  }

  render() {
    return (
      <ListItem
        topDivider={true}
        bottomDivider={true}
        containerStyle={[infoListStyles.container, {marginTop:22}]}
        titleStyle={[infoListStyles.title, infoListStyles.removeText]}
        title={translations("Panel.delete team")}
        onPress={this.onDeletePress.bind(this)}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(deletePanel), gql(getPanel), 'Panel')
)(DeletePanel);
