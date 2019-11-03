
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, listStyles, createByAtStyles } from '../../../config/stylesheets';

export { inputStyles, listStyles, createByAtStyles };

export const currentUserStyles = StyleSheet.create({
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
    fontSize: normalize(12.7),
    fontWeight: '400',
    color: colors.grey3,
  },
  rightTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#5fb8f6"
  },
  leftIcon: {
    color: "#5fb8f6",
  },
  checkboxContainer: {
    width: normalize(27),
    height: normalize(27),
  },
  activityIndicator: {
    height: normalize(15),
    width: normalize(15),
  },
  avatarContainer: {
    width: normalize(30.7),
    height: normalize(30.7),
    borderRadius: normalize(30.7/2)
  },
});

export const currentUserAvatarStyles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: normalize(150),
  },
  title: {
    fontSize: normalize(55.7),
    fontWeight: "bold",
    fontStyle: "normal",
    color: "#ffffff"
  },
});
