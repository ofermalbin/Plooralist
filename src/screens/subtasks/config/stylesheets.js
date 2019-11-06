import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

export const rowSubtaskStyles = StyleSheet.create({
  container: {
    minHeight: normalize(68),
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  title: {
    fontSize: normalize(17),
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "left",
    color: "#4f4f4f",
  },
  subtitle: {
    fontSize: normalize(12.7),
    fontWeight: '400',
    color: colors.grey3,
  },
  checkboxContainer: {
    width: normalize(37),
    height: normalize(37),
  },
});

export const infoTaskStyles = StyleSheet.create({
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
  lightTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#d7d7da"
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
  notificationText: {
    fontSize: normalize(12),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(12.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f"
  },
  removeText: {
    color: 'red',
    //textAlign: 'center'
  },
});
