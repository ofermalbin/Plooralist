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
    AmplifyButton,
    LinkCell,
    Header,
    ErrorRow
} from 'aws-amplify-react-native';

import PhoneField from './PhoneField';

import { ForgotPassword } from "aws-amplify-react-native";

const logger = new Logger('ForgotPassword');

export default class CustomForgotPassword extends ForgotPassword {
    constructor(props) {
        super(props);

        this._validAuthStates = ['forgotPassword'];
        this.state = {
          delivery: null,
          password: null,
        };

        this.send = this.send.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
      const chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789", "abcdefghijklmnopqrstuvwxyz"];
      const password = [1,4,3].map(function(len, i) { return Array(len).fill(chars[i]).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('') }).concat().join('').split('').sort(function(){return 0.5-Math.random()}).join('');
      this.setState({password});
    }

    submit() {
        const { username, code, password } = this.state;
        Auth.forgotPasswordSubmit(username, code, password)
            .then(data => {
                logger.debug(data);
                this.signIn()
                //this.changeState('signIn')
            })
            .catch(err => this.error(err));
    }

    signIn() {
        const { username, password } = this.state;
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
                    onChangeText={(text) => this.setState({ username: text })}
                    label={I18n.get('Phone Number')}
                    placeholder={I18n.get('Your phone number')}
                    keyboardType="phone-pad"
                    required={true}
                />
                <AmplifyButton
                    text={I18n.get('Send').toUpperCase()}
                    theme={theme}
                    onPress={this.send}
                    disabled={!this.state.username}
                />
            </View>
        )
    }

    submitBody(theme) {
        return (
            <View style={theme.sectionBody}>
                <FormField
                    theme={theme}
                    onChangeText={(text) => this.setState({ code: text })}
                    label={I18n.get('Confirmation Code')}
                    placeholder={I18n.get('Enter your confirmation code')}
                    required={true}
                />
                <AmplifyButton
                    text={I18n.get('Submit')}
                    theme={theme}
                    onPress={this.submit}
                    disabled={!this.state.username}
                />
            </View>
        )
    }

    showComponent(theme) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={theme.section}>
                    <Header theme={theme}>{I18n.get('Reinstall')}</Header>
                    <View style={theme.sectionBody}>
                        { !this.state.delivery && this.forgotBody(theme) }
                        { this.state.delivery && this.submitBody(theme) }
                    </View>
                    <View style={theme.sectionFooter}>
                        <LinkCell theme={theme} onPress={() => this.changeState('signUp')}>
                            {I18n.get('Back to Sign Up')}
                        </LinkCell>
                    </View>
                    <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
