import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import RNRestart from 'react-native-restart';

import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from 'aws-amplify';

import moment from 'moment/min/moment-with-locales.js';

import { ListItem, Icon } from 'react-native-elements';

import { normalize, colors } from  "react-native-elements";

import { AvatarS3Image } from '../../components';
import Loading from '../../components/Loading';

import { withCurrentUser } from '../../contexts';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateUser, deleteUser, createUser } from '../../graphql/mutations';
import { getUser } from '../../graphql/queries';

import { currentUserAvatarStyles, currentUserStyles, createByAtStyles } from './config/stylesheets';

import { PhotoEdit } from '../photos';

import { storeFileInS3 } from '../../lib/s3';

import uuid from 'react-native-uuid';

const Locales = {
  en: 'English',
  he: 'Hebrew',
};

const styles = StyleSheet.create({
  removeText: {
    color: 'red',
    //textAlign: 'center'
  },
})

const __capitalize_Words = function(str) {
  return str && str.replace (/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

class CurrentUserInfo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
    }
  }

  onNamePress() {
    this.props.navigation.navigate('UpdateCurrentUserName', {currentUser: this.props.currentUser});
  };

  onLocalePress() {
    this.props.navigation.navigate('UpdateCurrentUserLocale', {currentUser: this.props.currentUser});
  };

  onEmailPress() {
    this.props.navigation.navigate('UpdateCurrentUserEmail', {currentUser: this.props.currentUser});
  };

  onEditAvatarPress() {
    const { currentUser } = this.props;
    PhotoEdit({
      options: {
        cameraType:'front',
      },
      photo: currentUser.imgKey || this.state.source,
      removePhoto: () => {
        this.setState({source: null});
        const input = {
          id: currentUser.id,
          expectedVersion: currentUser.version,
          imgKey: null,
        };
        const offline = Object.assign(currentUser, {offline: true, imgKey: null, updatedAt: (new Date()).toISOString()});
        this.props.updateUser({...offline, input});
      },
      updatePhoto: async (photo) => {
        this.setState({source: photo});
        const awsKey = `${uuid.v1()}.jpeg`;
        const result = await storeFileInS3(photo, awsKey, "protected", currentUser.identityId);
        const input = {
          id: currentUser.id,
          expectedVersion: currentUser.version,
          imgKey: result.key,
        };
        const offline = Object.assign(currentUser, {offline: true, updatedAt: (new Date()).toISOString()});
        this.props.updateUser({...offline, input});
      }
    });
  }

  async deleteCognitoUser() {
    try {
      await Auth.currentAuthenticatedUser().then((user: CognitoUser) => {
        user.deleteUser(error => {
          if (error) {
              alert(error);
          }
          else {
            Auth.signOut();
            RNRestart.Restart();
          }
        });
      });
    } catch (error) {
      alert(error);
    }
  }

  onLogoutPress() {
    const { currentUser } = this.props;
    Alert.alert(
      'Logout Account',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          Auth.signOut()
            .then(() => RNRestart.Restart())
            .catch(err => alert(JSON.stringify(err)));
        }},
      ]
    )
  }

  onDeleteAccountPress() {
    const { currentUser } = this.props;
    Alert.alert(
      'Delete Account',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          const input = {
            id: currentUser.id,
            expectedVersion: currentUser.version,
            active: false,
          };
          const offline = Object.assign(currentUser, {offline: true, updatedAt: (new Date()).toISOString()});
          this.props.updateUser({...offline, input});
          this.deleteCognitoUser();
          this.props.navigation.goBack();
        }},
      ]
    )
  }

  render() {

    const { currentUser } = this.props;

    if (!currentUser) {
      return (
        <Loading />
      );
    }

    return (
      <ScrollView>
      <View>
        <AvatarS3Image
          source={this.state.source}
          imgKey={currentUser.imgKey}
          level='protected'
          identityId={currentUser.identityId}
          name={currentUser.name}
          containerStyle={currentUserAvatarStyles.container}
          titleStyle={currentUserAvatarStyles.title}
          rounded={false} showEditButton={true}
          showEditButton={true}
          editButton={{ size: 24 }}
          onEditPress={this.onEditAvatarPress.bind(this)}
          disabled={currentUser.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
        <ListItem
          containerStyle={currentUserStyles.container}
          titleStyle={currentUserStyles.title}
          subtitleStyle={currentUserStyles.subtitle}
          chevron={true}
          title={__capitalize_Words(currentUser.name)}
          subtitle={currentUser.phoneNumber}
          leftAvatar={
            <AvatarS3Image
              source={this.state.source}
              imgKey={currentUser.imgKey}
              level='protected'
              identityId={currentUser.identityId}
              name={currentUser.name}
              size='medium'
              rounded={true}
              onEditPress={this.onEditAvatarPress.bind(this)}
              showEditButton={true}
            />
          }
          onPress={this.onNamePress.bind(this)}
        />
        <View style={{ marginTop: 22 }}>
          <ListItem
            bottomDivider={true}
            containerStyle={currentUserStyles.container}
            titleStyle={currentUserStyles.title}
            rightTitleStyle={currentUserStyles.rightTitle}
            chevron={true}
            title='Locale'
            rightTitle={currentUser.locale ? Locales[currentUser.locale] : 'add'}
            leftIcon={{name: 'language', iconStyle: currentUserStyles.leftIcon}}
            onPress={this.onLocalePress.bind(this)}
          />
          <ListItem
            containerStyle={currentUserStyles.container}
            titleStyle={currentUserStyles.title}
            rightTitleStyle={currentUserStyles.rightTitle}
            chevron={true}
            title='Email'
            rightTitle={currentUser.email ? currentUser.email : 'add'}
            leftIcon={{name: 'mail', iconStyle: currentUserStyles.leftIcon}}
            onPress={this.onEmailPress.bind(this)}
          />
        </View>
        <View style={{ marginTop: 22 }}>
          <ListItem
            chevron={false}
            title='Logout'
            titleStyle={[currentUserStyles.title, styles.removeText]}
            onPress={this.onLogoutPress.bind(this)}
          />
          <ListItem
            chevron={false}
            title='Delete Account'
            titleStyle={[currentUserStyles.title, styles.removeText]}
            onPress={this.onDeleteAccountPress.bind(this)}
          />
        </View>
        <View style={createByAtStyles.container}>
          <Text style={createByAtStyles.text}>{`${'created at '}${moment(currentUser.createdAt).locale('en').format('LL')}.`}</Text>
        </View>
      </View>
      </ScrollView>
    )
  }
};

export default withCurrentUser(compose(
  graphql(gql(getUser), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        id: props.currentUser ? props.currentUser.id : null
      }
    }),
    props: props => ({
      currentUser: props.data.getUser ? props.data.getUser : null,
    })
  }),
  graphqlMutation(gql(updateUser), gql(getUser), 'User'),
  graphqlMutation(gql(deleteUser), gql(getUser), 'User'),
  graphqlMutation(gql(createUser), gql(getUser), 'User')
)(CurrentUserInfo));
