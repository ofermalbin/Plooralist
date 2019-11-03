import React from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    Picker,
    ScrollView
} from 'react-native';
import {
    Auth,
    I18n,
    Logger
} from 'aws-amplify';
import {
    FormField,
    //PhoneField,
    LinkCell,
    Header,
    ErrorRow,
    AmplifyButton
} from 'aws-amplify-react-native';

import PhoneField from './PhoneField';

import { SignIn } from "aws-amplify-react-native";

const logger = new Logger('SignIn');

import { StyleSheet, Alert } from 'react-native';
//import { Button } from 'react-native-elements';

import SplashScreen from 'react-native-splash-screen';

export default class CustomSignIn extends SignIn {

  constructor(props) {
    super(props);

    this.firstTime = true;

    this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
    this.state = {
      username: null,
      password: null,
      error: null,
    };
  }

  showComponent(theme) {
    requestAnimationFrame(() => {
      SplashScreen.hide();
      if(this.firstTime) {
        this.firstTime = false;
        this.changeState('signUp');
      }
    });
    if(this.firstTime) {
      return null;
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={theme.section}>
                <Header theme={theme}>{I18n.get('Sign in to demo account')}</Header>
                <View style={theme.sectionBody}>
                    <PhoneField
                        theme={theme}
                        onChangeText={(text) => this.setState({ username: text })}
                        label={I18n.get('Phone Number')}
                        placeholder={I18n.get('Phone number')}
                        keyboardType="phone-pad"
                        required={true}
                    />
                    <FormField
                        theme={theme}
                        onChangeText={(text) => this.setState({ password: text })}
                        label={I18n.get('Password')}
                        placeholder={I18n.get('Enter password')}
                        secureTextEntry={true}
                        required={true}
                    />
                    <AmplifyButton
                        text={I18n.get('Sign In').toUpperCase()}
                        theme={theme}
                        onPress={this.signIn}
                        disabled={!this.state.username || !this.state.password}
                    />
                </View>
                <View style={theme.sectionFooter}>
                    <LinkCell theme={theme} onPress={() => this.changeState('signUp')}>
                        {I18n.get('Back to Sign Up')}
                    </LinkCell>
                </View>
                <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
            </View>
        </TouchableWithoutFeedback>
    );
  }
}
