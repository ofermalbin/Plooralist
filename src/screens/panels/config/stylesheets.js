
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

export const rowPanelStyles = StyleSheet.create({
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

export const titlePanelStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: normalize(30.7),
    height: normalize(30.7),
    borderRadius: normalize(30.7/2)
  },
  nameContainer: {
    paddingLeft: 10,
  },
  nameText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.grey1,
  },
  teamNameText: {
    height: 14,
    fontSize: normalize(14.1),
    fontWeight: "bold",
    color: "#4f4f4f"
  },
  memberNameText: {
    height: 13,
    fontSize: normalize(12.7),
    color: "#4f4f4f",
  },
  memberCommaText: {
    height: 13,
    fontSize: normalize(12.7),
    color: "#4f4f4f",
    marginRight: 2,
  },
});
