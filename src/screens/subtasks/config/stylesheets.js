import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

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
