
import { StyleSheet, Dimensions } from 'react-native';

import { normalize, colors } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
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
  },
  send: {
    //width: 39.5,
    //height: 12,
    fontSize: 15.5,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#5fb8f6"
  },
  bubbleText: {
    fontSize: 15.8,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#323e45"
  }
});
export default styles;
