import React from 'react';
import { View } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { getPanel } from '../../../graphql/queries';
import { updatePanel } from '../../../graphql/mutations';

import { inputStyles } from '../config/stylesheets';

class EditPanelName extends React.Component {

  constructor(props) {
    super(props);

    const { panel } = props.navigation.state.params;
    this.state = {
      name: panel.name,
    }
    props.navigation.setParams({disabled: panel.name.length ? false : true, onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { panel } = this.props.navigation.state.params;
    const name = this.state.name.trim();
    const input = {
      id: panel.id,
      expectedVersion: panel.version,
      name
    };
    const offline = Object.assign(panel, {offline: true, name, updatedAt: (new Date()).toISOString()});
    this.props.updatePanel({...offline, input});
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
            placeholder="Name"
            onChangeText={this.onNameChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updatePanel), gql(getPanel), 'Panel')
) (EditPanelName)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Name",
      headerRight: () => <Button type="clear" title={translate("Common.Button.update")} titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onSavePress()} />,
      headerLeft: () => <Button type="clear" title={translate("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
