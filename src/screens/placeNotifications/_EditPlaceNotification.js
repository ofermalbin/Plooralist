import React from 'react';

import { View, Alert, ScrollView } from 'react-native';
import { ListItem, Icon, ButtonGroup } from 'react-native-elements';

import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';

import { getBoundsOfDistance, getDistance, computeDestinationPoint } from 'geolib';

import RNGooglePlaces from 'react-native-google-places';

import Geolocation from '@react-native-community/geolocation';

import { Chevron } from '../../components';

import { placeNotificationStyles } from './config/stylesheets';

class _EditPlaceNotification extends React.Component {

  constructor(props) {
    super(props);

    const place = props.place || { radius: 100, when: 0 };

    const region = props.place && {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta:  0.00922*1.5,
      longitudeDelta: 0.00421*1.5
    };

    this.state = {
      place: place,
      region: props.place ? {
        mapRegion: region,
        lastLat: region.latitude,
        lastLong: region.longitude,
      } : {
        mapRegion: null,
        lastLat: null,
        lastLong: null,
      },
    }

    this.onPlaceChange = this.onPlaceChange.bind(this);
  }

  openPlaceModal(params) {
    const boundsOfDistance = getBoundsOfDistance(params , 1000);

    RNGooglePlaces.openAutocompleteModal({
      locationBias: {
            latitudeSW: boundsOfDistance[0].latitude,
            longitudeSW: boundsOfDistance[0].longitude,
            latitudeNE: boundsOfDistance[1].latitude,
            longitudeNE: boundsOfDistance[1].longitude,
        }
      }, ['placeID', 'location', 'name'])
    .then((results) => {
      const place = Object.assign({}, this.state.place, results, results.location);
      this.onPlaceChange(place);
    })
    .catch(error => (error.code !== 'E_USER_CANCELED') && Alert.alert('openAutocompleteModal\n', error.message));
  }

  componentDidMount() {
    if (this.props.place) {
      RNGooglePlaces.lookUpPlaceByID(this.props.place.placeID, ['placeID', 'location', 'name'])
        .then((results) => {
          const place = Object.assign({}, this.props.place, results);
          this.onPlaceChange(place);
        })
        .catch((error) => console.log('lookUpPlaceByID error: ', error.message));
    }
    else {
      Geolocation.getCurrentPosition(
        (position) => {
          this.openPlaceModal( {latitude: position.coords.latitude, longitude: position.coords.longitude, radius: 0.01} );
        }
      )
      .catch((error) => console.log('getCurrentPosition error: ', error.message));
    }
  }

  onPlaceChange(place) {
    this.setState({place: place});
    const region = {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta:  0.00922*1.5,
      longitudeDelta: 0.00421*1.5
    }
    this.setState({
      region: {
        mapRegion: region,
        lastLat: region.latitude || this.state.region.lastLat,
        lastLong: region.longitude || this.state.region.lastLong
      }
    });
    this.props.onPlaceChange(place);
  }

  onLongPress(e) {
    const coordinate = e.nativeEvent.coordinate;
    this.openPlaceModal( {latitude: coordinate.latitude, longitude: coordinate.longitude, radius: 0.01} );
  }

  onRadiusChange(e) {
    const place = Object.assign({}, this.state.place, { radius: getDistance({
        latitude: this.state.region.mapRegion.latitude,
        longitude: this.state.region.mapRegion.longitude,
      }, {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      })
     });
     this.onPlaceChange(place)
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal({}, ['placeID', 'location', 'name'])
      .then((results) => {
        const place = Object.assign({}, this.state.place, results, results.location);
        this.onPlaceChange(place);
        })
      .catch(error => console.log(error.message));
  }

  openUserLocationPlaceModal() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.openPlaceModal( {latitude: position.coords.latitude, longitude: position.coords.longitude, radius: 0.01} );
      }
    )
  }

  openCurrentPlaceModal() {
    if (this.state.place.placeID) {
      RNGooglePlaces.lookUpPlaceByID(this.state.place.placeID, ['placeID', 'location', 'name'])
        .then((results) => {
          this.openPlaceModal( {latitude: this.state.place.latitude, longitude: this.state.place.longitude, radius: 0.01} );
        })
        .catch((error) => console.log('lookUpPlaceByID error: ', error.message));
    }
  }

  indexUpdate(selectedIndex) {
    const place = Object.assign({}, this.state.place, { when: selectedIndex });
    this.onPlaceChange(place)
  }

  render() {
    const buttons = ['Enter', 'Exit'];

    return (
      <ScrollView>
        <View>
        <View style={placeNotificationStyles.map_container}>
          <MapView
            //provider={PROVIDER_GOOGLE}
            style={placeNotificationStyles.map}
            onLongPress={this.onLongPress.bind(this)}
            region={this.state.region.mapRegion}
            showsUserLocation={true}
            userLocationAnnotationTitle='My Location'
            showsMyLocationButton={true}
            >
            {this.state.place.placeID && this.state.region.mapRegion && this.state.region.mapRegion.latitude && this.state.region.mapRegion.longitude &&
            <MapView.Marker
              ref={ref => { this.marker = ref; }}
              coordinate={{
                latitude: this.state.region.mapRegion.latitude,
                longitude: this.state.region.mapRegion.longitude
              }}
            />}
            {this.state.place.placeID && this.state.region.mapRegion && this.state.region.mapRegion.latitude && this.state.region.mapRegion.longitude &&
            <MapView.Marker
              coordinate={
                computeDestinationPoint({
                    latitude: this.state.region.mapRegion.latitude,
                    longitude: this.state.region.mapRegion.longitude,
                  }, this.state.place.radius, 90)
                }
              pinColor='blue'
              image={require('./blue-circle.png')}
              draggable
              onPress={(e) => {}}
              onDragEnd={this.onRadiusChange.bind(this)}
            />}
            {this.state.place.placeID && this.state.region.mapRegion && this.state.region.mapRegion.latitude &&
            <MapView.Circle
              center={{
                latitude: this.state.region.mapRegion.latitude,
                longitude: this.state.region.mapRegion.longitude,
              }}
              radius={this.state.place.radius}
              strokeWidth = {3}
              strokeColor = {'#1a66ff'}
              fillColor = {'rgba(230,238,255,0.5)'}
            />}
          </MapView>
          <View style={placeNotificationStyles.map_icons_container}>
            {this.props.place && <Icon name='delete' color='red' containerStyle={{paddingLeft: 10, paddingRight: 80, paddingTop: 10, paddingBottom: 30}} onPress={this.props.onDeletePress.bind(this)} />}
            <Icon name='my-location' containerStyle={{padding: 10}} onPress={this.openUserLocationPlaceModal.bind(this)} />
            {this.state.place && this.state.place.placeID && <Icon name='edit-location' containerStyle={{padding: 10}} onPress={this.openCurrentPlaceModal.bind(this)} />}
            <Icon name='search' containerStyle={{padding: 10}} onPress={this.openSearchModal.bind(this)} />
          </View>
        </View>
        <View style={{ marginTop: 22 }}>
          <ListItem
            topDivider={true}
            bottomDivider={true}
            containerStyle={placeNotificationStyles.container}
            titleStyle={placeNotificationStyles.title}
            rightTitleStyle={placeNotificationStyles.rightTitle}
            subtitleStyle={placeNotificationStyles.subtitle}
            chevron={<Chevron />}
            title='Place'
            rightTitle={this.state.place.name ? this.state.place.name : 'Add'}
            onPress={this.state.place.name ? this.openCurrentPlaceModal.bind(this) : this.openUserLocationPlaceModal.bind(this)}
          />
          <ListItem
            bottomDivider={true}
            containerStyle={placeNotificationStyles.container}
            titleStyle={placeNotificationStyles.title}
            rightTitleStyle={placeNotificationStyles.rightTitle}
            title='Radius'
            rightTitle={this.state.place.radius.toString()}
          />
          <ListItem
            buttonGroup={{
              onPress: this.indexUpdate.bind(this),
              selectedIndex: this.state.place.when,
              buttons: buttons,
            }}
          />
        </View>
      </View>
      </ScrollView>
    )
  }
}

export default _EditPlaceNotification;
