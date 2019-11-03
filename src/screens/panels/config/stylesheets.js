
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

import { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles } from '../../../config/stylesheets';

export { inputStyles, listStyles, createByAtStyles, actionListStyles, infoListStyles, infoAvatarStyles };

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
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f"
  },
  memberNameText: {
    height: 13,
    fontSize: normalize(12.7),
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f",
  },
  memberCommaText: {
    height: 13,
    fontSize: normalize(12.7),
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "left",
    color: "#4f4f4f",
    marginRight: 2,
  },
});
