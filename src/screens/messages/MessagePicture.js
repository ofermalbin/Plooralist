import React from 'react';
import { View } from 'react-native';

import { Button, Input, Card } from 'react-native-elements';

import styles from './styles';

import uuid from 'react-native-uuid';

import { storeFileInS3 } from '../../lib/s3';

import Loading from '../../components/Loading';

class MessagePicture extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Message Picture",
        headerRight: <Button type="clear" title="Add" titleStyle={{color: '#5fb8f6'}} onPress={() => params.onAddPress()} />,
        headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    this.state = {
      text: null,
      upload: null,
    }
    props.navigation.setParams({onAddPress: this.onAddPress.bind(this)});
  }

  async onAddPress() {
    const { navigation } = this.props;
    const { picture, onSend } = this.props.navigation.state.params;
    const text = this.state.text ? this.state.text.trim() : null;
    const awsKey = `${uuid.v1()}.jpeg`;
    this.setState({upload: true});
    const { access, key } = await storeFileInS3(picture, awsKey, "public");
    const message = Object.assign({}, {text: text}, {imgKey: key});
    onSend([message]);
    navigation.goBack();
  }

  onTextChange(text) {
    this.setState({text: text});
  }

  render() {
    const { picture } = this.props.navigation.state.params;

    if(this.state.upload) {
      return <Loading />
    }

    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
        <Card image={{uri: picture}}>
          <Input
            inputStyle={styles.input}
            value={this.state.text}
            autoFocus={true}
            placeholder="Text"
            onChangeText={this.onTextChange.bind(this)}
          />
        </Card>
      </View>
    )
  }
}

export default MessagePicture;
