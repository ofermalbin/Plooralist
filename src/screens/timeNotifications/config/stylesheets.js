import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

export const timeNotificationStyles = StyleSheet.create({
  container: {
    minHeight: normalize(55),
  },
  title: {
    fontSize: normalize(15),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f"
  },
  subtitle: {
    fontSize: normalize(14),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(14.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#5fb8f6",
  },
  notificationText: {
    fontSize: normalize(12),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(12.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f"
  },
  recurrenceTextContainer: {
    marginTop: normalize(12),
    marginLeft: normalize(12),
  },
  recurrenceText: {
    fontSize: normalize(13),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#b0b5b8"
  },
  removeText: {
    color: 'red',
  },
});
