import React from 'react';

import { StyleSheet, View } from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';

import { Icon, ListItem, normalize } from "react-native-elements";

import Voice from 'react-native-voice';

import * as Animatable from 'react-native-animatable';

import translate, { getI18nConfig } from '../../translations';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});

class Voice2Text extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: translate("Common.Voice.voice to text"),
        headerLeft: () => <HeaderBackButton label={translate("Common.Button.back")} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    this.state = {
      partialResults: [],
    }

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentDidMount() {
    this._startRecognizing.bind(this)();
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      partialResults: [],
    });
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value,
    });
  }

  onSpeechResults(e) {
    this.props.navigation.state.params.onStopRecognizing(e.value);
  }

  async _startRecognizing(e) {
    const { languageTag } = getI18nConfig();
    try {
      await Voice.start(languageTag);
    } catch (e) {
      console.error(e);
    }
  }

  async _stopRecognizing(e) {
    try {
      await Voice.stop();
      this.props.navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  }

  async _cancelRecognizing(e) {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }

  async _destroyRecognizer(e) {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={{flex:0.8}}>
        <ListItem
          titleStyle={{fontWeight: '300', fontSize: normalize(20), textAlign: "left"}}
          title={this.state.partialResults.join(' ') || translate("Common.Voice.speech")}
        />
        </View>
        <View style={{flex:0.2}}>
        <Animatable.View animation="shake" duration={25000}>
        <Icon
          name='mic-off'
          color='red'
          size={64}
          onPress={this._stopRecognizing.bind(this)}
        />
        </Animatable.View>
        </View>
      </View>
    )
  }
}

export default Voice2Text;
