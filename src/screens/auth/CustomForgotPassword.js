import React from 'react';
import {
    View
} from 'react-native';
import {
    Auth,
    I18n,
    Logger
} from 'aws-amplify';
import {
    FormField,
    AmplifyButton
} from 'aws-amplify-react-native';

import { ForgotPassword } from "aws-amplify-react-native";

const logger = new Logger('ForgotPassword');

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
}
