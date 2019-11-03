
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

export const textVoiceInputStyles = StyleSheet.create({
  container: {
    //height: normalize(50),
    //backgroundColor: "#eff8fe"
  },
  inputContainer: {
    borderBottomWidth: 0,
    alignSelf: 'flex-start'
  },
  rightIcon: {
    color: colors.primary,
    width: normalize(26.7),
    height: normalize(26.7),
  },
  input: {
    height: null,
    //minHeight: 36,
    fontSize: normalize(15),
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: normalize(15.8),
    letterSpacing: 0,
    textAlign: "left",
    color: "#5fb8f6"
  }
});
