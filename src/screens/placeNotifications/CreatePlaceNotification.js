import React from 'react';

import { View } from 'react-native';

import { ListItem, Button } from 'react-native-elements';

import Radar from 'react-native-radar';

import _EditPlaceNotification from './_EditPlaceNotification';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { createPlaceNotification } from '../../graphql/mutations';
import { listPlaceNotifications } from '../../graphql/queries';

import { pick } from 'lodash';

import { placeNotificationStyles } from './config/stylesheets';

class CreatePlaceNotification extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Place Nonification",
        headerRight: <Button type="clear" title="Add" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
        headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    this.state = {
      place: null,
    }

    props.navigation.setParams({disabled: true, onAddPress: this.onAddPress.bind(this)});
  }

  onAddPress() {
    const { task } = this.props.navigation.state.params;

    const input = {
      placeNotificationTaskId: task.id,
      ...pick(this.state.place, ['placeID', 'name', 'latitude', 'longitude', 'when', 'radius'])
    };

    const now = new Date();
    const offline = {
      ...input,
      offline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    this.props.createPlaceNotification({...offline, input: input});
    Radar.trackOnce().then((result) => {}).catch((err) => {});
    this.props.navigation.goBack();
  }

  onPlaceChange(place) {
    this.setState({place: place});
    this.state.place.placeID && this.props.navigation.setParams({disabled:false, onAddPress: this.onAddPress.bind(this)});
  }

  render() {
    return (
      <_EditPlaceNotification onPlaceChange={this.onPlaceChange.bind(this)} />    )
  }
}

const enhance = compose(
  graphqlMutation(gql(createPlaceNotification), variables => ({query: gql(listPlaceNotifications), variables: {filter: {placeNotificationTaskId: {eq: variables.placeNotificationTaskId}}}}), 'PlaceNotification')
) (CreatePlaceNotification)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Place Nonification",
      headerRight: <Button type="clear" title="Add" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
