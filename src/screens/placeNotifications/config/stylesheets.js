import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

export const placeNotificationStyles = StyleSheet.create({
  map_container: {
    height: SCREEN_HEIGHT/2.5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  map_icons_container: {
    position: 'absolute',
    bottom: -25,
    left: 75,
    //marginTop: -45,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    minHeight: normalize(55),
  },
  title: {
    fontSize: normalize(15),
    fontWeight: "bold",
    color: "#4f4f4f"
  },
  subtitle: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: "#5fb8f6",
  },
  rightTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    color: "#5fb8f6"
  },
  notificationText: {
    fontSize: normalize(12),
    fontWeight: "bold",
    color: "#4f4f4f"
  },
  removeText: {
    color: 'red',
  },
});
