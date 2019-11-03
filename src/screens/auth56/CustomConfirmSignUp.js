import React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {
    Auth,
    I18n,
    Logger
} from 'aws-amplify';
import {
    FormField,
    LinkCell,
    Header,
    ErrorRow,
    AmplifyButton
} from 'aws-amplify-react-native';

import { ConfirmSignUp } from 'aws-amplify-react-native';

const logger = new Logger('ConfirmSignUp');

export default class CustomConfirmSignUp extends ConfirmSignUp {
    constructor(props) {
        super(props);

        this._validAuthStates = ['confirmSignUp'];
        this.state = {
            username: null,
            password: null,
            code: null,
            error: null
        }

        this.confirm = this.confirm.bind(this);
        this.resend = this.resend.bind(this);
    }

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
              this.signIn()
              //this.changeState('signedUp')
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

    resend() {
        const { username } = this.state;
        logger.debug('Resend Sign Up for ' + username);
        Auth.resendSignUp(username)
            .then(() => logger.debug('code sent'))
            .catch(err => this.error(err));
    }

    showComponent(theme) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={theme.section}>
                    <Header theme={theme}>{I18n.get('Confirm Sign Up')}</Header>
                    <View style={theme.sectionBody}>
                        <FormField
                            theme={theme}
                            onChangeText={(text) => this.setState({ username: text })}
                            label={I18n.get('Username')}
                            placeholder={I18n.get('Enter your username')}
                            required={true}
                            value={this.state.username}
                        />
                        <FormField
                            theme={theme}
                            onChangeText={(text) => this.setState({ code: text })}
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
                        <LinkCell theme={theme} onPress={this.resend} disabled={!this.state.username}>
                            {I18n.get('Resend code')}
                        </LinkCell>
                        <LinkCell theme={theme} onPress={() => this.changeState('signIn')}>
                          {I18n.get('Back to Sign In')}
                        </LinkCell>
                    </View>
                    <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
