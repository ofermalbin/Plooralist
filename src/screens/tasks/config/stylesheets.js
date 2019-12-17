import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

export const titleTaskStyles = StyleSheet.create({
  nameText: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#4f4f4f"
  },
});

export const rowTaskStyles = StyleSheet.create({
  container: {
    minHeight: normalize(68),
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  title: {
    fontSize: normalize(17),
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
    color: "#4f4f4f",
    textAlign: 'left'
  },
  lightTitle: {
    fontSize: normalize(15),
    fontWeight: "bold",
    color: "#d7d7da",
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
  notificationText: {
    fontSize: normalize(12),
    fontWeight: "bold",
    color: "#4f4f4f"
  },
  removeText: {
    color: 'red',
    //textAlign: 'center'
  },
});
