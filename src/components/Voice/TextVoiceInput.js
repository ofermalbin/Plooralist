import React from 'react';
import PropTypes from 'prop-types';

import { View, ActivityIndicator } from 'react-native';

import { ListItem, Input } from "react-native-elements";

import Voice from 'react-native-voice';

import { cloneDeep } from 'lodash';

import translate, { getI18nConfig } from '../../translations';

import { textVoiceInputStyles } from './config/stylesheets';

import colors from '../../config/colors';

class TextVoiceInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    }
  }

  onSave() {
    let value = cloneDeep(this.state.value);
    value = value.trim();
    if (value.length) {
      this.props.onSave(value);
    }
    else {
      this.setState({value: value});
    }
  }

  onStopRecognizing(results) {
    const value = results.length ? results[0] : '';
    this.setState({value: value});
  }

  render() {

    const value = cloneDeep(this.state.value);

    return (
      <ListItem
        bottomDivider={true}
        containerStyle={textVoiceInputStyles.container}
        rightIcon={
          {
            size: textVoiceInputStyles.rightIcon.width,
            color: textVoiceInputStyles.rightIcon.color,
            name: value.length ? 'send' : 'mic',
            onPress: () => value.length ? this.onSave.bind(this)() : this.props.navigation.navigate('Voice2Text', {onStopRecognizing: this.onStopRecognizing.bind(this)}),
          }
        }
        title={
          <Input
            inputStyle={textVoiceInputStyles.input}
            inputContainerStyle={textVoiceInputStyles.inputContainer}
            placeholder={translate("Common.Input.placeholder")}
            clearButtonMode="always"
            value={value}
            //onBlur={() => this.setState({value: ''})}
            blurOnSubmit={false}
            onSubmitEditing={this.onSave.bind(this)}
            onChangeText={(value) => this.setState({value: value})}
          />
        }
        /*input={{
          inputStyle: textVoiceInputStyles.input,
          //inputContainerStyle: textVoiceInputStyles.inputContainer,
          placeholder: "Say something...",
          clearButtonMode: "always",
          value: value,
          //onBlur: () => this.setState({value: ''}),
          blurOnSubmit: false,
          onSubmitEditing: this.onSave.bind(this),
          onChangeText: (value) => this.setState({value: value}),
        }}*/
      />
    )
  }
}

export default TextVoiceInput;
