/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import React from 'react';
import { Dimensions, Image, View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Auth, I18n, Logger, JS } from 'aws-amplify';
//import AuthPiece from './AuthPiece';
import {
	AmplifyButton,
	FormField,
	//PhoneField,
	LinkCell,
	Header,
	ErrorRow,
} from 'aws-amplify-react-native';

import PhoneField from './PhoneField';

const logger = new Logger('SignIn');

import { SignIn } from "aws-amplify-react-native";

import SplashScreen from 'react-native-splash-screen';

import DeviceInfo from 'react-native-device-info';

const SCREEN_WIDTH = Dimensions.get('window').width

export default class CustomSignIn extends SignIn {

  componentDidMount() {
    SplashScreen.hide();
    this.setState({ isSignIn: null });
		DeviceInfo.isEmulator().then(isEmulator => this.setState({isEmulator}));
  }

	showSignInComponent(theme) {
		return (
				<View style={theme.section}>
					<Header theme={theme}>{I18n.get('Sign in to demo account')}</Header>
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
						<FormField
							theme={theme}
							onChangeText={text => this.setState({ password: text })}
							label={I18n.get('Password')}
							placeholder={I18n.get('Enter your password')}
							secureTextEntry={true}
							required={true}
						/>
						<AmplifyButton
							text={I18n.get('Sign In').toUpperCase()}
							theme={theme}
							onPress={this.signIn}
							disabled={!this.getUsernameFromInput() && this.state.password}
						/>
					</View>
					<View style={theme.sectionFooter}>
						<LinkCell theme={theme} onPress={() => this.setState({ isSignIn: false })}>
							{I18n.get('Back to Welcome page')}
						</LinkCell>
					</View>
				</View>
		);
	}

  showWelcomePageComponent(theme) {
    return (
        <View style={theme.section}>
          <Header theme={theme}>{I18n.get('Plooralist')}</Header>
					<Image style={{width: SCREEN_WIDTH*0.85, height: 280}} source={require('./plooralist_welcome.png')}/>
          <View style={theme.sectionBody}>
            <AmplifyButton
              text={I18n.get('Join now').toUpperCase()}
              theme={theme}
              onPress={() => this.changeState('signUp')}
            />
          </View>
          <View style={theme.sectionFooter}>
						<LinkCell
							theme={theme}
							onPress={() => this.changeState('confirmSignUp')}>
							{I18n.get('Confirm a Code')}
						</LinkCell>
            <LinkCell
            theme={theme}
            onPress={() => this.changeState('forgotPassword')}>
            {I18n.get('ReInstallation')}
          </LinkCell>
          {(this.state.isEmulator || null) && <LinkCell theme={theme} onPress={() => this.setState({ isSignIn: true })}>
            {I18n.get('Demo account')}
          </LinkCell>}
          </View>
        </View>
    );
  }

  showComponent(theme) {
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={theme.section}>
					{!this.state.isSignIn && this.showWelcomePageComponent(theme)}
					{this.state.isSignIn && this.showSignInComponent(theme)}
					<ErrorRow theme={theme}>{this.state.error}</ErrorRow>
				</View>
			</TouchableWithoutFeedback>
		);
    return (this.state.isSignIn ? this.showSignInComponent(theme) : this.showWelcomePageComponent(theme));
  }
}
