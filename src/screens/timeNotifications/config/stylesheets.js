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
    fontSize: normalize(12),
    fontWeight: "bold",
    color: "#4f4f4f",
    textAlign: 'left'
  },
  subtitle: {
    fontSize: normalize(12),
    //fontWeight: "bold",
    color: "#b0b5b8",
    textAlign: 'left'
  },
  notificationText: {
    fontSize: normalize(12),
    fontWeight: "bold",
    color: "#4f4f4f",
    textAlign: 'left'
  },
  sendText: {
    fontSize: normalize(12),
    color: "#b0b5b8",
    marginTop: normalize(4),
    textAlign: 'left'
  },
  recurrenceText: {
    fontSize: normalize(12),
    color: "#b0b5b8",
    marginTop: normalize(4),
    marginLeft: normalize(12),
  },
  removeText: {
    color: 'red',
  },
});
