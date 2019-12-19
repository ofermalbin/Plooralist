import React from 'react';
import { SignIn } from "aws-amplify-react-native";

import SplashScreen from 'react-native-splash-screen';

export default class CustomSignIn extends SignIn {

  componentDidMount() {
    SplashScreen.hide();
  }
}
