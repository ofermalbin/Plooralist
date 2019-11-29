
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

import { listStyles } from '../../../config/stylesheets';

export { listStyles };

export const rowRowContactIsUserStyles = StyleSheet.create({
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
  },
  subtitle: {
    fontSize: normalize(12.7),
    fontWeight: '400',
    color: colors.grey3,
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
