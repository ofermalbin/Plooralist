import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateUser } from '../../graphql/mutations';
import { getUser } from '../../graphql/queries';

import translate from '../../translations';

import { inputStyles } from './config/stylesheets';

class UpdateCurrentUserName extends React.Component {

  constructor(props) {
    super(props);

    const { currentUser } = props.navigation.state.params;
    this.state = {
      name: currentUser.name,
    }
    props.navigation.setParams({disabled: currentUser.name.length ? false : true, onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { currentUser } = this.props.navigation.state.params;
    const name = this.state.name.trim();
    const input = {
      id: currentUser.id,
      expectedVersion: currentUser.version,
      name,
    };
    const offline = Object.assign(currentUser, {offline: true, name, updatedAt: (new Date()).toISOString()});
    this.props.updateUser({...offline, input});
    this.props.navigation.goBack();
  }

  onNameChange(name) {
    this.props.navigation.setParams({disabled: name.trim().length ? false : true, onSavePress: this.onSavePress.bind(this)});
    this.setState({name});
  }

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
      <ListItem
        topDivider={true}
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.name}
            autoFocus={true}
            placeholder={translate("CurrentUser.name")}
            onChangeText={this.onNameChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateUser), gql(getUser), 'User')
) (UpdateCurrentUserName)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: translate("CurrentUser.name"),
      headerRight: () => <Button type="clear" title={translate("Common.Button.update")} titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onSavePress()} />,
      headerLeft: () => <Button type="clear" title={translate("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
