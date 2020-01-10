
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, createByAtStyles } from '../../../config/stylesheets';

export { inputStyles, createByAtStyles };

export const rowCurrentUserStyles = StyleSheet.create({
  container: {
    minHeight: normalize(68),
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  separator:{
    height: 0.7,
    backgroundColor: "#c6ced4"
  },
  title: {
    fontSize: normalize(14.7),
    fontWeight: "bold",
    color: "#4f4f4f",
    textAlign: 'left'
  },
  subtitle: {
    fontSize: normalize(12.7),
    fontWeight: '400',
    color: colors.grey3,
    textAlign: 'left'
  },
  rightTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    color: "#5fb8f6"
  },
  leftIcon: {
    color: "#5fb8f6",
  },
  rightIcon: {
    color: "#5fb8f6",
  },
  checkboxContainer: {
    width: normalize(37),
    height: normalize(37),
  },
});

export const currentUserStyles = StyleSheet.create({
  container: {
    minHeight: normalize(55),
  },
  title: {
    fontSize: normalize(15),
    fontWeight: "bold",
    color: "#4f4f4f",
    textAlign: 'left'
  },
  subtitle: {
    fontSize: normalize(12.7),
    fontWeight: '400',
    color: colors.grey3,
    textAlign: 'left'
  },
  rightTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
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
});

export const currentUserAvatarStyles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: normalize(150),
  },
  title: {
    fontSize: normalize(55.7),
    fontWeight: "bold",
    color: "#ffffff"
  },
});
