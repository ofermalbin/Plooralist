import React from 'react';
import PropTypes from 'prop-types';

import { View, Dimensions, Clipboard } from 'react-native';

import { Icon } from 'react-native-elements';

import { GiftedChat, Actions, MessageImage, Bubble, Send } from 'react-native-gifted-chat';

import { pick, orderBy } from 'lodash';

import Geolocation from '@react-native-community/geolocation';

import { withCurrentUser } from '../../contexts';

import CustomView from './CustomView';

import { S3Image, AvatarS3Image } from '../../components';

import { launchCamera, launchImageLibrary } from '../photos';

import translate from '../../translations';

import styles from './config/styles';

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
      const { id, offline, messageUserId, user, imgKey, uri } = message;
      const message_user = Object.assign({}, user, { _id: messageUserId} );
      return Object.assign({}, {_id: id, offline: offline}, pick(message, ['text', 'place', 'updatedAt']), {user: message_user}, imgKey && {imgKey: imgKey, image: 'yes!', image_index: image_index++}, uri && {uri: uri, image: 'yes!', image_index: image_index++});
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
      [translate("Photo.take photo")]: () => launchCamera({updatePhoto: (photo) => this.props.onSend({uri: photo})}),
      [translate("Photo.choose photo from library")]: () => launchImageLibrary({updatePhoto: (photo) => this.props.onSend({uri: photo})}),
      [translate("Message.my location")]: () => Geolocation.getCurrentPosition((position) => {
          const place = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          this.props.onSend({place: JSON.stringify(place)})
        }
      ),
      //"": () => {},
      [translate("Common.Button.cancel")]: () => {},
      //"Cancel": () => {},
    };
    return (
      <Actions {...this.props} icon={this.renderIconActions} options={options} />
    );
  }

  renderMessageImage(props) {
    const { currentMessage } = props;
    return (
        <S3Image
          source={currentMessage.uri}
          imgKey={currentMessage.imgKey}
          level='public'
          width={150}
          height={100}
          borderRadius={13}
          margin={3}
          resizeMode='cover'
        />
    );
  }

  renderAvatar(props) {
    const { user } = props.currentMessage;
    return (
        <AvatarS3Image
          imgKey={user.imgKey}
          level='protected'
          identityId={user.identityId}
          name={user.name}
          size='small'
          rounded={true}
        />
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
    //this.props.panel && alert(this.props.panel.type);
    return (
      <GiftedChat
        locale='en'
        placeholder={translate("Message.placeholder")}
        showAvatarForEveryMessage={false}
        renderAvatarOnTop={true}
        showUserAvatar={false}
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        renderActions={this.renderActions.bind(this)}
        renderBubble={this.renderBubble.bind(this)}
        renderAvatar={(this.props.panel && (this.props.panel.type === 3)) ? this.renderAvatar.bind(this) : null}
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
