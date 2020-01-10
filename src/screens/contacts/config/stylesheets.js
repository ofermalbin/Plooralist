
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

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
    textAlign: "left",
    color: "#5fb8f6"
  },
  checkboxContainer: {
    width: normalize(27),
    height: normalize(27),
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
