
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

export const searchStyles = StyleSheet.create({
  container: {
    //height: normalize(68),
    //backgroundColor: "#eff8fe"
  },
  rightIcon: {
    width: normalize(20.7),
    height: normalize(20.7),
  },
  input: {
    //height: null,
    minHeight: 36,
    //fontSize: normalize(14.7),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
  },
});

export const inputStyles = StyleSheet.create({
  container: {
    //height: normalize(50),
    //backgroundColor: "#eff8fe"
  },
  rightIcon: {
    color: colors.primary,
    width: normalize(20.7),
    height: normalize(20.7),
  },
  input: {
    height: null,
    minHeight: 36,
    fontSize: normalize(15),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#5fb8f6"
  }
});

export const listStyles = StyleSheet.create({
  container: {
    minHeight: normalize(68),
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  section:{
    fontSize: normalize(10),
    backgroundColor: 'whitesmoke',
    padding: 5,
  },
  separator:{
    height: 0.7,
    backgroundColor: "#c6ced4"
  },
  title: {
    fontSize: normalize(14.7),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15),
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f",
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
  rightIcon: {
    color: "#5fb8f6",
  },
  avatarContainer: {
    width: normalize(46.7),
    height: normalize(46.7),
    borderRadius: normalize(46.7/2)
  },
  checkboxContainer: {
    width: normalize(37),
    height: normalize(37),
  },
});

export const actionListStyles = StyleSheet.create({
  container: {
    minHeight: normalize(68),
    //paddingLeft: normalize(20),
    paddingRight: normalize(20),
    backgroundColor: "#eff8fe",
  },
  title: {
    fontSize: normalize(14.7),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15),
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f",
  },
  leftIconAvatarContainer: {
    width: normalize(46.7),
    height: normalize(46.7),
    borderRadius: normalize(46.7/2)
  },
  leftIconAvatarIcon: {
    borderRadius: normalize(46.7/2),
    color: '#a5aaad',
  },
  leftIconAvatarPlaceholder: {
    backgroundColor: "#dfe7ec",
  },
});

export const infoAvatarStyles = StyleSheet.create({
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

export const infoListStyles = StyleSheet.create({
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

export const titleStyles = StyleSheet.create({
  container: {
    height: normalize(30.7),
  },
  title: {
    fontSize: normalize(14.7),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15),
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f",
  },
  subtitle: {
    fontSize: normalize(12.7),
    fontWeight: '400',
    color: colors.grey3,
  },
  avatarContainer: {
    width: normalize(30.7),
    height: normalize(30.7),
    borderRadius: normalize(30.7/2)
  },
});

export const createByAtStyles = StyleSheet.create({
  container: {
    marginTop: normalize(12),
    marginLeft: normalize(12),
  },
  text: {
    fontSize: normalize(13),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#b0b5b8"
  },
});

export const pickerStyles = StyleSheet.create({
  container: {
    minHeight: normalize(55),
  },
  label: {
    fontSize: normalize(15),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#5fb8f6"
  },
});
