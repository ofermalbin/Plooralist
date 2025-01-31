import React from 'react';
import { ScrollView, View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Auth, I18n, Logger, JS } from 'aws-amplify';
//import AuthPiece from './AuthPiece';
import {
  FormField,
	//PhoneField,
	LinkCell,
	Header,
	ErrorRow,
	AmplifyButton,
} from 'aws-amplify-react-native';

import PhoneField from './PhoneField';

const logger = new Logger('SignUp');

import { SignUp } from "aws-amplify-react-native";

import { parsePhoneNumberFromString, parsePhoneNumber, ParseError } from 'libphonenumber-js';

export default class CustomSignUp extends SignUp {

  componentDidMount() {
    const chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789", "abcdefghijklmnopqrstuvwxyz"];
    //const password = [1,4,3].map(function(len, i) { return Array(len).fill(chars[i]).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function(){return 0.5-Math.random()}).join('');
    const password = '@Ofer270560';
    this.setState({password});
  }

  signUp() {
    if (!Auth || typeof Auth.signUp !== 'function') {
      throw new Error(
        'No Auth module found, please ensure @aws-amplify/auth is imported'
      );
    }

    const signup_info = {
      username: this.state.username,
      password: this.state.password,
      attributes: {},
    };

    const inputKeys = Object.keys(this.state);
    const inputVals = Object.values(this.state);

    inputKeys.forEach((key, index) => {
      if (!['username', 'password', 'checkedValue'].includes(key)) {
        if (
          key !== 'phone_line_number' &&
          key !== 'dial_code' &&
          key !== 'error'
        ) {
          const newKey = `${this.needPrefix(key) ? 'custom:' : ''}${key}`;
          signup_info.attributes[newKey] = inputVals[index];
        }
      }
    });

    let labelCheck = false;
    this.signUpFields.forEach(field => {
      if (field.label === this.getUsernameLabel()) {
        logger.debug(`Changing the username to the value of ${field.label}`);
        signup_info.username =
          signup_info.attributes[field.key] || signup_info.username;
        labelCheck = true;
      }
    });
    if (!labelCheck && !signup_info.username) {
      // if the customer customized the username field in the sign up form
      // He needs to either set the key of that field to 'username'
      // Or make the label of the field the same as the 'usernameAttributes'
      throw new Error(
        `Couldn't find the label: ${this.getUsernameLabel()}, in sign up fields according to usernameAttributes!`
      );
    }

    logger.debug('Signing up with', signup_info);
    Auth.signUp(signup_info)
      .then(data => {
        this.changeState('confirmSignUp', {username: data.user.username, password: this.state.password})
      })
      .catch(err => this.error(err));
  }

  showComponent(theme) {
    if (this.checkCustomSignUpFields()) {
      this.signUpFields = this.props.signUpConfig.signUpFields;
    }
    this.sortFields();
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={theme.section}>
          <Header theme={theme}>{I18n.get(this.header)}</Header>
          <View style={theme.sectionBody}>
            {this.signUpFields.map(field => {
              return field.key !== 'phone_number' ? (
                <FormField
                  key={field.key}
                  theme={theme}
                  type={field.type}
                  secureTextEntry={field.type === 'password'}
                  onChangeText={text => {
                    const stateObj = this.state;
                    stateObj[field.key] = text;
                    this.setState(stateObj);
                  }}
                  label={I18n.get(field.label)}
                  placeholder={I18n.get(field.placeholder)}
                  required={true}
                />
              ) : (
                <PhoneField
                  theme={theme}
                  key={'phone_number'}
                  onChangeText={text => this.setState({ phone_number: text })}
                  label={I18n.get('Phone Number')}
                  placeholder={I18n.get('Enter your phone number')}
                  keyboardType="phone-pad"
                  required={true}
                />
              );
            })}
            <AmplifyButton
              text={I18n.get('Sign Up').toUpperCase()}
              theme={theme}
              onPress={this.signUp}
              disabled={!this.isValid}
            />
          </View>
          <View style={theme.sectionFooter}>
            <LinkCell theme={theme} onPress={() => this.changeState('signIn')}>
              {I18n.get('Back to Welcome page')}
            </LinkCell>
          </View>
          <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}
