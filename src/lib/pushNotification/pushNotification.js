import React from 'react';

import { Platform, Alert } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { Analytics } from 'aws-amplify';

export const onRegister = async token => {
  try {
    await AsyncStorage.setItem('@deviceToken', token);
  } catch (e) {
    console.log(e);
  }
}

export const updateEndpoint = async (userId, analyticsAppId) => {
  let deviceToken = null;
  try {
    if (Platform.OS === 'ios') {
      deviceToken = await AsyncStorage.getItem('@deviceToken');
      //Alert.alert('Ios Device @deviceToken', deviceToken);
    }
    else if (Platform.OS === 'android') {
      deviceToken = await AsyncStorage.getItem('@deviceToken');
      if (deviceToken) {
        //Alert.alert('Android Device @deviceToken', deviceToken);
      }
      else {
        deviceToken = await AsyncStorage.getItem('push_token' + analyticsAppId);
        //Alert.alert('push_token', deviceToken || 'Null');
      }
    }
  } catch(e) {
    console.log(e);
    Alert.alert('Get Device Token Error', e);
  }
  try {
    if(deviceToken !== null) {
      const updateEndpoint = await Analytics.updateEndpoint({
        channelType: (Platform.OS === 'ios') ? 'APNS' : 'GCM', // The channel type. Valid values: APNS, GCM
        address: deviceToken,
        optOut: 'NONE',
        userId: userId,
      });
    }
  } catch(e) {
    console.log(e);
    Alert.alert('Update Endpoint Error', JSON.stringify(e));
  }
}
