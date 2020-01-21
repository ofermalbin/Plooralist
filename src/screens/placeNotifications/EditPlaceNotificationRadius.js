import React from 'react';

import { View } from 'react-native';
import { ListItem, Button, Input } from 'react-native-elements';

import translations from '../../translations';

import { inputStyles } from './config/stylesheets';

class EditPlaceNotificationRadius extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: translations("TimeNotification.time notification"),
        headerRight: () => <Button type="clear" title={translations("Common.Button.ok")} titleStyle={{color: '#5fb8f6'}} onPress={() => params.onSavePress()} />,
        headerLeft: () => <Button type="clear" title={translations("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props, context) {
    super(props);

    const { place } = this.props.navigation.state.params;
    this.state = {
      radius: place.radius.toString(),
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSavePress: this.onSavePress.bind(this) });
  }

  onSavePress() {
    const { radius } = this.state;
    if (radius) {
      const { onRadiusChange } = this.props.navigation.state.params;
      onRadiusChange(parseInt(radius));
      this.props.navigation.goBack();
    }
  }

  onChange(radius) {
    parseInt(radius) && this.setState({radius});
  }

  render() {
    return (
      <View style={{ marginTop: 22, flex:1 }}>
      <ListItem
        topDivider={true}
        title={
          <Input
            keyboardType='numeric'
            inputStyle={inputStyles.input}
            value={this.state.radius}
            autoFocus={true}
            placeholder="Radius"
            onChangeText={this.onChange.bind(this)}
          />
        }
      />
      </View>
    )
  }
}

export default EditPlaceNotificationRadius;
