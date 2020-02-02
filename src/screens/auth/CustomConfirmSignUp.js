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

const logger = new Logger('ConfirmSignUp');

import { ConfirmSignUp } from 'aws-amplify-react-native';

export default class CustomConfirmSignUp extends ConfirmSignUp {

    componentWillReceiveProps(nextProps) {
      const { username, password } = (nextProps && nextProps.authData) ? nextProps.authData : {};
      if (username && !this.state.username) {
        this.setState({ username });
      }
      if (password && !this.state.password) {
        this.setState({ password });
      }
    }

    confirm() {
      const { username, code } = this.state;
      logger.debug('Confirm Sign Up for ' + username);
      Auth.confirmSignUp(username, code)
        .then(data => {
          //this.changeState('signedUp')
          this.signIn();
        })
        .catch(err => this.error(err));
    }

    signIn() {
        const { username, password } = this.state;
        logger.debug('Sign In for ' + username);
        Auth.signIn(username, password)
            .then(user => {
                logger.debug(user);
                this.checkContact(user);
            })
            .catch(err => this.error(err));
    }

    showComponent(theme) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={theme.section}>
            <Header theme={theme}>{I18n.get('Confirm Sign Up')}</Header>
            <View style={theme.sectionBody}>
              <PhoneField
  							theme={theme}
  							key={'phone_number'}
  							onChangeText={text => this.setState({ phone_number: text })}
  							label={I18n.get('Phone Number')}
  							placeholder={I18n.get('Enter your phone number')}
  							keyboardType="phone-pad"
  							required={true}
                value={this.state.username}
  						/>
              <FormField
                theme={theme}
                onChangeText={text => this.setState({ code: text })}
                label={I18n.get('Confirmation Code')}
                placeholder={I18n.get('Enter your confirmation code')}
                required={true}
              />
              <AmplifyButton
                theme={theme}
                text={I18n.get('Confirm')}
                onPress={this.confirm}
                disabled={!this.state.username || !this.state.code}
              />
            </View>
            <View style={theme.sectionFooter}>
              <LinkCell
                theme={theme}
                onPress={this.resend}
                disabled={!this.state.username}
              >
                {I18n.get('Resend code')}
              </LinkCell>
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
