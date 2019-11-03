import React from 'react';
import {
    Auth,
    I18n,
    Logger
} from 'aws-amplify';

import { ConfirmSignUp } from 'aws-amplify-react-native';

const logger = new Logger('ConfirmSignUp');

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
}
