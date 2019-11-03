import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateUser } from '../../graphql/mutations';
import { getUser, listUsers } from '../../graphql/queries';

import { inputStyles } from './config/stylesheets';

class UpdateCurrentUserEmail extends React.Component {

  constructor(props) {
    super(props);

    const { currentUser } = props.navigation.state.params;
    this.state = {
      email: currentUser.email,
    }
    props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { currentUser } = this.props.navigation.state.params;
    const email = this.state.email;
    const input = {
      id: currentUser.id,
      expectedVersion: currentUser.version,
      email,
    };
    const offline = Object.assign(currentUser, {offline: true, email, updatedAt: (new Date()).toISOString()});
    this.props.updateUser({...offline, input});
    this.props.navigation.goBack();
  }

  onEmailChange(email) {
    this.props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
    this.setState({email});
  }

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
      <ListItem
        topDivider={true}
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.email}
            autoFocus={true}
            placeholder="Email"
            onChangeText={this.onEmailChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateUser), gql(listUsers), 'User')
) (UpdateCurrentUserEmail)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Email",
      headerRight: <Button type="clear" title="Update" titleStyle={{color: '#5fb8f6'}} onPress={() => params.onSavePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
