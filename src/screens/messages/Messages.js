import React from 'react';
import PropTypes from 'prop-types';

import { View, Dimensions, Clipboard } from 'react-native';

import { Icon } from 'react-native-elements';

import { GiftedChat, Actions, MessageImage, Bubble, Send } from 'react-native-gifted-chat';

import { pick, orderBy } from 'lodash';

import Geolocation from '@react-native-community/geolocation';

import { withCurrentUser } from '../../contexts';

import CustomView from './CustomView';

import { GiftedMessageS3Image, GiftedAvatarS3Image } from '../../components';

import { launchCamera, launchImageLibrary } from '../photos';

import styles from './styles';

class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  _toGiftedMessages(messages) {
    let image_index = 0;
    return (orderBy(messages, 'updatedAt', 'desc')).map((message) => {
      const { id, messageUserId, user, imgKey, image } = message;
      const message_user = Object.assign({}, user, { _id: messageUserId} );
      return Object.assign({}, {_id: id}, pick(message, ['text', 'place', 'updatedAt']), {user: message_user}, imgKey && {imgKey: imgKey, image: 'yes!', image_index: image_index++});
    })
  }

  componentDidMount() {
    const { messages } = this.props;
    this.setState({
      messages: this._toGiftedMessages(messages),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { messages } = nextProps;
    this.setState({
      messages: this._toGiftedMessages(messages),
    });
  }

  onSend(messages = []) {
    this.props.onSend(messages[0]);
  }

  renderIconActions(props) {
    return (
      <Icon type='entypo' name='attachment' color='#c6ced4' />
    );
  }

  renderActions() {
    const options = {
      'Take Picture': () => {
        launchCamera({
          updatePhoto: (photo) => this.props.navigation.navigate('MessagePicture', {onSend: this.onSend.bind(this), picture: photo})
        })
      },
      'Choose Picture': () => {
        launchImageLibrary({
          updatePhoto: (photo) => this.props.navigation.navigate('MessagePicture', {onSend: this.onSend.bind(this), picture: photo})
        })
      },
      'My Location': () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const place = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
            this.props.onSend({
              place: JSON.stringify(place),
            })
          }
        )
      },
      'Cancel': () => {},
    };
    return (
      <Actions {...this.props} icon={this.renderIconActions} options={options} />
    );
  }

  renderMessageImage(props) {
    return (
        <GiftedMessageS3Image {...props} />
    );
  }

  renderAvatar(props) {
    return (
        <GiftedAvatarS3Image {...props} />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView {...props} navigation={this.props.navigation} />
    );
  }

  renderBubble(props) {
    return (
      <Bubble {...props}
        textStyle={{
          right: styles.bubbleText,
          left: styles.bubbleText,
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#c1e2f6',
          },
          right: {
            backgroundColor: '#ffffff',
          },
        }}
     />
    );
  }

  renderSend(props) {
    return (
      <Send {...props} label="SEND" textStyle={styles.send} />
    );
  }

  onLongPress(context, message) {
    if (message.text) {
      const options = [
        'Copy Text',
        'Cancel',
      ];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(message.text);
            break;
        }
      });
    }
  }

  render() {
    return (
      <GiftedChat
        locale='en'
        placeholder='Start typing...'
        showAvatarForEveryMessage={false}
        renderAvatarOnTop={true}
        showUserAvatar={true}
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        renderActions={this.renderActions.bind(this)}
        renderBubble={this.renderBubble.bind(this)}
        renderAvatar={this.renderAvatar.bind(this)}
        renderMessageImage={this.renderMessageImage.bind(this)}
        renderSend={this.renderSend.bind(this)}
        renderCustomView={this.renderCustomView.bind(this)}
        onLongPress={this.onLongPress.bind(this)}
        user={{_id: this.props.currentUser.id}}
      />
    );
  }
}

export default withCurrentUser(Messages);
