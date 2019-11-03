import React from 'react';
import { Platform, Alert } from 'react-native';

import { Auth } from 'aws-amplify';

import { CurrentAuthContext } from './CurrentAuthContext';

export default class CurrentAuthProvider extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentAuth: null,
    }
  }

  async componentDidMount() {
    const currentAuth = await Auth.currentAuthenticatedUser({ bypassCache: false }); // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    this.setState({ currentAuth });
  }

  render() {
    return (
      <CurrentAuthContext.Provider value={{currentAuth: this.state.currentAuth}}>
        {this.props.children}
      </CurrentAuthContext.Provider>
    )
  }
}
