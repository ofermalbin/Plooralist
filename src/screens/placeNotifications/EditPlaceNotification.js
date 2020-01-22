import React from 'react';

import { StyleSheet, View, Alert } from 'react-native';

import { ListItem, Button } from 'react-native-elements';

import RRule from 'rrule';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updatePlaceNotification, deletePlaceNotification } from '../../graphql/mutations';
import { listPlaceNotificationsForTask } from '../../graphql/queries';

import { pick } from 'lodash';

import _EditPlaceNotification from './_EditPlaceNotification';

import { listPlaceNotificationsForTaskVariables } from './util';

import translate from '../../translations';

import { placeNotificationStyles } from './config/stylesheets';

class EditPlaceNotification extends React.Component {

  constructor(props) {
    super(props);

    const { placeNotification } = props.navigation.state.params;

    this.state = {
      place: placeNotification,
    }

    props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { placeNotification } = this.props.navigation.state.params;

    const input = {
      id: placeNotification.id,
      ...pick(this.state.place, ['placeID', 'name', 'latitude', 'longitude', 'when', 'radius']),
      expectedVersion: placeNotification.version
    };

    const now = new Date();
    const offline = Object.assign(placeNotification, {offline: true, ...pick(this.state.place, ['placeID', 'name', 'latitude', 'longitude', 'when', 'radius']), updatedAt: (new Date()).toISOString()});

    this.props.updatePlaceNotification({...offline, input});
    this.props.navigation.goBack();
  }

  onPlaceChange(place) {
    this.setState({place: place});
  }

  onDeletePress() {
    const now = new Date();

    Alert.alert(
      'Delete Place Notification',
      translate("Common.Alert.are you sure?"),
      [
        {text: translate("Common.Button.cancel")},
        {text: translate("Common.Button.ok"), onPress: () => {
          const { placeNotification } = this.props.navigation.state.params;
          const input = {
            id: placeNotification.id,
            expectedVersion: placeNotification.version
          };
          const offline = Object.assign(placeNotification, {offline: true});
          this.props.deletePlaceNotification({...offline, input});
          this.props.navigation.goBack();
        }},
      ]
    )
  }

  render() {
    const { placeNotification } = this.props.navigation.state.params;
    return (
      <_EditPlaceNotification place={placeNotification} onPlaceChange={this.onPlaceChange.bind(this)} onDeletePress={this.onDeletePress.bind(this)} navigation={this.props.navigation} />
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updatePlaceNotification), variables => ({ query: gql(listPlaceNotificationsForTask), variables: listPlaceNotificationsForTaskVariables(variables.placeNotificationTaskId)}), 'PlaceNotification'),
  graphqlMutation(gql(deletePlaceNotification), variables => ({ query: gql(listPlaceNotificationsForTask), variables: listPlaceNotificationsForTaskVariables(variables.placeNotificationTaskId)}), 'PlaceNotification')
) (EditPlaceNotification)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: translate("PlaceNotification.place notification"),
      headerRight: () => <Button type="clear" title={translate("Common.Button.save")} titleStyle={{color: '#5fb8f6'}} onPress={() => params.onSavePress()} />,
      headerLeft: () => <Button type="clear" title={translate("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
