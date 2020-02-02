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

const logger = new Logger('ForgotPassword');

import { ForgotPassword } from "aws-amplify-react-native";

export default class CustomForgotPassword extends ForgotPassword {

    componentDidMount() {
      const chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789", "abcdefghijklmnopqrstuvwxyz"];
      //const password = [1,4,3].map(function(len, i) { return Array(len).fill(chars[i]).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function(){return 0.5-Math.random()}).join('');
      const password = '@Ofer270560';
      this.setState({password});
    }

    submit() {
      const { code, password } = this.state;
      const username = this.getUsernameFromInput();
      Auth.forgotPasswordSubmit(username, code, password)
        .then(data => {
          logger.debug(data);
          this.signIn(username, password);
          //this.changeState('signIn');
        })
        .catch(err => this.error(err));
    }

    signIn(username, password) {
        logger.debug('Sign In for ' + username);
        Auth.signIn(username, password)
            .then(user => {
                logger.debug(user);
                //this.checkContact(user);
            })
            .catch(err => this.error(err));
    }

    forgotBody(theme) {
      return (
        <View style={theme.sectionBody}>
          <PhoneField
  					theme={theme}
  					key={'phone_number'}
  					onChangeText={text => this.setState({ phone_number: text })}
  					label={I18n.get('Phone Number')}
  					placeholder={I18n.get('Enter your phone number')}
  					keyboardType="phone-pad"
  					required={true}
  				/>
          <AmplifyButton
            text={I18n.get('Send').toUpperCase()}
            theme={theme}
            onPress={this.send}
            disabled={!this.getUsernameFromInput()}
          />
        </View>
      );
    }

    submitBody(theme) {
      return (
        <View style={theme.sectionBody}>
          <FormField
            theme={theme}
            onChangeText={text => this.setState({ code: text })}
            label={I18n.get('Confirmation Code')}
            placeholder={I18n.get('Enter your confirmation code')}
            required={true}
          />
          <AmplifyButton
            text={I18n.get('Submit')}
            theme={theme}
            onPress={this.submit}
            disabled={!(this.state.code && this.state.password)}
          />
        </View>
      );
    }

    showComponent(theme) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={theme.section}>
            <Header theme={theme}>{I18n.get('ReInstallation')}</Header>
            <View style={theme.sectionBody}>
              {!this.state.delivery && this.forgotBody(theme)}
              {this.state.delivery && this.submitBody(theme)}
            </View>
            <View style={theme.sectionFooter}>
              <LinkCell theme={theme} onPress={() => this.changeState('signIn')}>
                {I18n.get('Back to Welcome page')}
              </LinkCell>
            </View>
            <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
          </View>
        </TouchableWithoutFeedback>
      );
    }
}
