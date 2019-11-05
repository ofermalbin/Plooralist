import React from 'react';

import { Platform, Alert } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import _ from 'lodash';

import { Auth, Analytics } from 'aws-amplify';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { getCurrentUser, listUsers } from '../../graphql/queries';

import { CurrentUserContext } from './CurrentUserContext';

import awsmobile from '../../../src/aws-exports';

class CurrentUserProvider extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      let deviceToken = null;
      try {
        if (Platform.OS === 'ios') {
          deviceToken = await AsyncStorage.getItem('@deviceToken');
        }
        else if (Platform.OS === 'android') {
          deviceToken = await AsyncStorage.getItem('@deviceToken');
          if (!deviceToken) {
            deviceToken = await AsyncStorage.getItem('push_token' + awsmobile.aws_mobile_analytics_app_id);
            Alert.alert('push_token', deviceToken || 'Nil');
          }
          else {
            Alert.alert('Android Device @deviceToken', deviceToken);
          }
        }
        if(deviceToken !== null) {
          const updateEndpoint = await Analytics.updateEndpoint({
            address: deviceToken,
            optOut: 'NONE',
            userId: currentUser.id,
          });
        }
      } catch(e) {
        console.log(e);
        Alert.alert('Get Device Token Error', e);
      }
    }
  }

  async componentWillReceiveProps(nextProps, nextState) {
    const { currentUser } = nextProps;

    if (this.props.currentUser) {
      return;
    }
    if (currentUser) {
      let deviceToken = null;
      try {
        if (Platform.OS === 'ios') {
          deviceToken = await AsyncStorage.getItem('@deviceToken');
        }
        else if (Platform.OS === 'android') {
          deviceToken = await AsyncStorage.getItem('push_token' + awsmobile.aws_mobile_analytics_app_id);
        }
        if(deviceToken !== null) {
          const updateEndpoint = await Analytics.updateEndpoint({
            address: deviceToken,
            optOut: 'NONE',
            userId: currentUser.id,
          });
        }
      } catch(e) {
        console.log(e);
        Alert.alert('Get Device Token Error', e);
      }
    };
  }

  render() {
    return (
      <CurrentUserContext.Provider value={{currentUser: this.props.currentUser}}>
        {this.props.children}
      </CurrentUserContext.Provider>
    )
  }
}

export default compose(
  graphql(gql(getCurrentUser), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      currentUser: props.data.getCurrentUser ? props.data.getCurrentUser : null,
    })
  })
)(CurrentUserProvider);
