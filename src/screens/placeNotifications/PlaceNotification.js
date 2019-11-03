import React from 'react';
import PropTypes from 'prop-types';

import { Text, Alert } from 'react-native';

import { pick } from 'lodash';

import Radar from 'react-native-radar';

import Loading from '../../components/Loading';

import { ListItem, Button, Icon, Divider } from 'react-native-elements';

import { placeNotificationStyles } from './config/stylesheets';

const when = ['Enter', 'Exit'];

class PlaceNotification extends React.Component {

  constructor(props) {
    super(props);
  }

  onPlaceNotificationPress(placeNotification) {
    this.props.navigation.navigate('EditPlaceNotification', {placeNotification: placeNotification});
  }

  onTestPress(placeNotification) {

    const location = {
      latitude: placeNotification.latitude,
      longitude: placeNotification.longitude,
      accuracy: placeNotification.radius - 1
    };

    Radar.updateLocation(location).then((result) => {
      // do something with result.events, result.user.geofences
    }).catch((err) => {
      alert(JSON.stringify(err))
    });
  }

  render() {

    const { task, isTaskOwner, placeNotification } = this.props;

    if (!placeNotification && !isTaskOwner) {
      return <Loading />;
    }

    return (
      <ListItem
        bottomDivider={true}
        containerStyle={placeNotificationStyles.container}
        titleStyle={placeNotificationStyles.notificationText}
        subtitleStyle={placeNotificationStyles.notificationText}
        chevron={isTaskOwner}
        //key={placeNotification.id}
        title={placeNotification.name}
        subtitle={`${when[placeNotification.when]}  ${placeNotification.radius} meters`}
        onLongPress={isTaskOwner ? this.onTestPress.bind(this, placeNotification) : null}
        onPress={isTaskOwner ? this.onPlaceNotificationPress.bind(this, placeNotification) : null}
      />
    )
  }
}

export default PlaceNotification;
