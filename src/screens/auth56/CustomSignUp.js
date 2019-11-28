import React from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
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

import { SignUp } from "aws-amplify-react-native";

const logger = new Logger('SignUp');

import { StyleSheet, Alert } from 'react-native';
//import { Button } from 'react-native-elements';
import { parsePhoneNumberFromString, parsePhoneNumber, ParseError } from 'libphonenumber-js';

import SplashScreen from 'react-native-splash-screen';

export default class CustomSignUp extends SignUp {
  constructor(props) {
    super(props);

    this._validAuthStates = ['signUp'];

    this.state = {
      username: null,
      password: null,
      phone_number: null,
      name: null
    };
  }

  componentDidMount() {
    const chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789", "abcdefghijklmnopqrstuvwxyz"];
    const password = [1,4,3].map(function(len, i) { return Array(len).fill(chars[i]).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function(){return 0.5-Math.random()}).join('');
    this.setState({password});
    //SplashScreen.hide();
  }

  showComponent(theme) {
      requestAnimationFrame(() => {
        SplashScreen.hide();
      });
      return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <ScrollView style={theme.section}>
                  <Header theme={theme}>{I18n.get(this.header)}</Header>
                  <View style={theme.sectionBody}>
                    <PhoneField
                        theme={theme}
                        onChangeText={(text) => {
                          this.setState({ phone_number: text });
                          this.setState({ username: text })
                        }}
                        label={I18n.get('Phone Number')}
                        placeholder={I18n.get('Your phone number')}
                        keyboardType="phone-pad"
                        required={true}
                    />
                    <FormField
                        theme={theme}
                        onChangeText={(text) => this.setState({ name: text })}
                        label={I18n.get('Name')}
                        placeholder={I18n.get('Enter your name')}
                        required={true}
                    />
                    <AmplifyButton
                        text={I18n.get('Sign Up').toUpperCase()}
                        theme={theme}
                        onPress={this.signUp}
                        disabled={!this.state.phone_number || !this.state.username || !this.state.password || !this.state.name}
                    />
                  </View>
                  <View style={theme.sectionFooter}>
                    <LinkCell
        							theme={theme}
        							onPress={() => this.changeState('confirmSignUp')}
        						>
        							{I18n.get('Confirm a Code')}
        						</LinkCell>
                    <LinkCell theme={theme} onPress={() => this.changeState('forgotPassword')}>
                        {I18n.get('Reinstall')}
                    </LinkCell>
                    <LinkCell theme={theme} onPress={() => this.changeState('signIn')}>
                        {I18n.get('Demo account')}
                    </LinkCell>
                  </View>
                  <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
              </ScrollView>
          </TouchableWithoutFeedback>
      );
  }

  signUp() {
    const parsePhoneNumber = parsePhoneNumberFromString(this.state.phone_number);
    if (parsePhoneNumber) {
      const phoneNumber = parsePhoneNumber.number;
      this.setState({username: phoneNumber});
      this.setState({phone_number: phoneNumber});
      const signup_info = {
        username: phoneNumber,
        password: this.state.password,
        attributes: {
          phone_number: phoneNumber,
          name: this.state.name
        }
      };
      console.log('signup_info', JSON.stringify(signup_info));
      Auth.signUp(signup_info).then((data) => {
        console.log('data_signup_info', JSON.stringify(data));
        this.changeState('confirmSignUp', {username: data.user.username, password: this.state.password})
      })
      .catch(err => {
        alert(JSON.stringify(err));
        this.error(err);
      });
    }
    else {
      this.setState({error : 'Invalid phone number format. Please use a phone number format of +12345678900'});
    }
  }
}
