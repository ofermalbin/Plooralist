import React from 'react';
import { SignIn } from "aws-amplify-react-native";

import SplashScreen from 'react-native-splash-screen';

export default class CustomSignIn extends SignIn {

  componentDidMount() {
    requestAnimationFrame(() => {
      SplashScreen.hide();
      this.changeState('signUp');
    });
  }
}
