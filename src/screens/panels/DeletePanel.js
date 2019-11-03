import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listPanels } from '../../graphql/queries';
import { deletePanel } from '../../graphql/mutations';

import { ListItem } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

class DeletePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onDeletePress() {
    const { member } = this.props;
    Alert.alert(
      'Delete',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          const input = {
            id: member.panel.id,
            expectedVersion: member.panel.version,
          };
          const offline = Object.assign(member.panel, {offline: true, updatedAt: (new Date()).toISOString()});
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
        chevron={false}
        title='Delete'
        onPress={this.onDeletePress.bind(this)}
      />
    )
  }
}

export default compose(
  graphqlMutation(gql(deletePanel), variables => ({query: gql(listPanels), variables: {filter: {id: {eq: variables.id }}}}), 'Panel')
)(DeletePanel);
