import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  View,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';

import { ListItem, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';

import moment from 'moment/min/moment-with-locales.js';

export default class CustomView extends React.Component {

  render() {
    if (this.props.currentMessage.place) {
      const placeParse = JSON.parse(this.props.currentMessage.place);
      const place = ((typeof placeParse) === 'string') ? JSON.parse(placeParse) : placeParse;
      return (
        <TouchableOpacity onPress={() => {
          const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${place.latitude},${place.longitude}`,
            android: `http://maps.google.com/?q=${place.latitude},${place.longitude}`
          });
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              //return Linking.openURL(url);
            }
          }).catch(err => {
            console.error('An error occurred', err);
          });
        }}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={[styles.mapView, this.props.mapViewStyle]}
            region={{
              latitude: place.latitude,
              longitude: place.longitude,
              latitudeDelta:  0.00922*0.2,
              longitudeDelta: 0.00421*0.2
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
          <MapView.Marker
            ref={ref => { this.marker = ref; }}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,              
            }}
          />
          </MapView>
        </TouchableOpacity>
      );
    }
    return null;
  }
}

const positionStyles = {
  left: StyleSheet.create({
    title: {
      color: 'black',
    },
  }),
  right: StyleSheet.create({
    title: {
      color: 'white',
    },
  }),
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 200,
    borderRadius: 13,
    margin: 3,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  placeView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    backgroundColor: 'white',
  },
  timeView: {
    width: 150,
    borderRadius: 13,
    margin: 3,
    backgroundColor: 'white',
  },
});
