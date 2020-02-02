/*
adminaws
AKIA4GIFNSAIXKFEWYWU
8BgxbHoaHZf2/niufNadJSk+PLgNleDaU2DLtC4E

/Users/ofermalbin/Documents/GitHub/Plooralist/__keys__/ios/NotificationCertificates.p12
AAAA7b0uGnk:APA91bGAaTMUDxHGDL1c69smJFUkGC1kZWBPOMj_VSqejRexd1xkVwdua6qHvFaUAOSArple_fLiTfhp5Exzne8mrQ1GLDYrSaRLgH0YnKECgrjhDWJBaZuCip_BiRAQtQekVVu0AK8n

code-push release-react Plooralist ios -t "1.0.73"
code-push release-react Plooralist android
*/

/*
rm -rf node_modules/ && yarn cache clean && yarn install && cd ios && pod install && cd ..
*/

import 'react-native-gesture-handler';

import React from 'react';
import { Platform, SafeAreaView, View, Text, Alert } from 'react-native';
import { YellowBox } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import Amplify, { Analytics, Auth } from 'aws-amplify';
import { AmplifyTheme } from 'aws-amplify-react-native';
import { Loading, SignIn, RequireNewPassword } from 'aws-amplify-react-native';

import PushNotificationIOS from "@react-native-community/push-notification-ios";

import PushNotification from '@aws-amplify/pushnotification';

import aws_exports from './src/aws-exports';

import { Authenticator } from 'aws-amplify-react-native';

import { Rehydrated } from "aws-appsync-react";

import AWSAppSyncClient from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';

import { createAppContainer } from 'react-navigation';

import { CurrentAuthProvider, CurrentUserProvider, ContactsProvider, UsersAreContactsProvider } from './src/contexts';

import AppStack from './src/navigation';

import { NavigationActions } from 'react-navigation';

import { CustomSignIn, CustomSignUp, CustomConfirmSignUp, CustomForgotPassword } from './src/screens/auth';

import SplashScreen from 'react-native-splash-screen';

import codePush from 'react-native-code-push';

import * as RNLocalize from 'react-native-localize';
import { setI18nConfig, setRruleI18nConfig, setAmplifyI18nConfig } from './src/translations';

import { onRegister } from './src/lib/pushNotification';

Amplify.configure(aws_exports);
Analytics.configure(aws_exports);
PushNotification.configure(aws_exports);

let notificationResult = null;

const onNotification = notification => {
  notificationResult = notification;
};

PushNotification.onRegister(onRegister);
PushNotification.onNotification(onNotification);

const client = new AWSAppSyncClient({
  url: aws_exports.aws_appsync_graphqlEndpoint,
  region: aws_exports.aws_appsync_region,
  auth: {
    type: aws_exports.aws_appsync_authenticationType,
    apiKey: aws_exports.aws_appsync_apiKey,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  offlineConfig: {
    callback: (err, succ) => {
      if(err) {
        const { mutation, variables, error } = err;
        //alert(`ERROR for ${mutation} ${err}`);
        if (err.error.graphQLErrors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
          Alert.alert(mutation, 'Refresh and try again');
        }
        else {
          Alert.alert(`graphQL-> ${mutation}`, err.error.graphQLErrors[0].errorType);
        }
      }
    },
  },
})

const AppContainer = createAppContainer(AppStack);

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.IMMEDIATE };

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.handleNotification = this.handleNotification.bind(this);
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    SplashScreen.hide();
    this.handleNotification();
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange)
  }

  handleNotification() {

    const _alertNotification = (title, body, objType, objId) => {
     Alert.alert(
       title,
       body,
       (objType && objId) ?
       [
         {
           text: 'OK',
           onPress: () => {
             switch(objType) {
               case "task":
                 this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: 'InfoTask', params: {taskId: objId, isMemberManager: true} }));
                 break;
               case "panel":
                 //this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: 'InfoPanel', params: {panelId: objId} }));
                 break;
               default:
                 ;
             }
           }
         },
         {
           text: 'Cancel',
         },
       ]
       :
       [
         {
           text: 'OK'
         },
       ]
     )
    };

    const _onNotification = notification => {
      if (Platform.OS === 'ios') {
       const { objType, objId } = notification._data.data['jsonBody'];
       _alertNotification(notification._alert['title'], notification._alert['body'], objType, objId);
      }
      else if (Platform.OS === 'android') {
       const { objType, objId } = JSON.parse(notification.data['pinpoint.jsonBody']);
       _alertNotification(notification.title, notification.body, objType, objId);
      }
    }

    if (notificationResult)  {
      _onNotification(notificationResult);
      notificationResult = null;
    };

    // get the notification data when notification is received
    PushNotification.onNotification((notification) => {
      _onNotification(notification);
    });
 }

 handleLocalizationChange() {
   try {
     setI18nConfig();
     setRruleI18nConfig();
     setAmplifyI18nConfig();
     this.forceUpdate();
   }
   catch(error) {
     console.error(error)
   }
   /*setI18nConfig().then(() => this.forceUpdate()).catch(error => {console.error(error)});
   setRruleI18nConfig().then(() => this.forceUpdate()).catch(error => {console.error(error)});
   setAmplifyI18nConfig().then(() => this.forceUpdate()).catch(error => {console.error(error)});*/
 }

 render() {

    return (
      <ApolloProvider client={client}>
      <CurrentAuthProvider>
      <ContactsProvider>
      <UsersAreContactsProvider>
      <CurrentUserProvider>
      <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Rehydrated>
          <ActionSheetProvider>
            <AppContainer ref={nav => {this.navigator = nav}} />
          </ActionSheetProvider>
        </Rehydrated>
      </View>
      </SafeAreaView>
      </CurrentUserProvider>
      </UsersAreContactsProvider>
      </ContactsProvider>
      </CurrentAuthProvider>
      </ApolloProvider>
    )
  }
}

const signUpConfig = {
  header: 'Sign Up',
  hiddenDefaults: ['email', 'password'],
  signUpFields: [
    {
      label: 'Name',
      key: 'name',
      required: true,
      type: 'string'
    },
  ]
};

class AppWithAuth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      authState: null,
    }

    YellowBox.ignoreWarnings([
      'componentWillMount has been renamed', // TODO: Remove when fixed
      'componentWillReceiveProps has been renamed', // TODO: Remove when fixed
      'componentWillUpdate has been renamed', // TODO: Remove when fixed
      'VirtualizedLists should never be nested', // TODO: Remove when fixed
      'Setting a timer', // supress settimeout warning on Android TODO: Remove when fixed
    ]);
  }

  handleStateChange = state => {
    this.setState({
      authState: state
    });
  }

  render() {
    const { authState } = this.state;
    if (authState != "signedIn") {
      return (
        <Authenticator
          onStateChange={this.handleStateChange.bind(this)}
          amplifyConfig={aws_exports}
          hideDefault={true}
          signUpConfig={signUpConfig}
          usernameAttributes='phone_number'
        >
          <Loading/>
          <CustomSignIn/>
          <CustomSignUp signUpConfig={signUpConfig}/>
          <CustomConfirmSignUp/>
          <CustomForgotPassword/>
          <RequireNewPassword/>
        </Authenticator>
      )
    }
    else {
      return (
        <App/>
      )
    }
  }
}

export default codePush(codePushOptions)(AppWithAuth);
