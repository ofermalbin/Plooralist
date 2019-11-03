import React from 'react';
import { Storage } from 'aws-amplify';

import { Avatar } from 'react-native-gifted-chat';

export default class GiftedAvatarS3Image extends React.Component {
  constructor(props) {
      super(props);

      this.state = { avatar: null };
  }

  componentDidMount() {
    const { imgKey } = this.props.currentMessage.user;
    imgKey && this.getImageSource(imgKey);
  }

  getImageSource(imgKey) {
    Storage.get(imgKey, { level : 'public'})
      .then(url => {
        //alert(url);
        this.setState({ avatar: url });
      })
      .catch(err => alert(err));
  }

  render() {
    const user = Object.assign({}, this.props.currentMessage.user, this.state.avatar && {avatar: this.state.avatar});
    const currentMessage = Object.assign({}, this.props.currentMessage, {user: user});
    return (
      <Avatar {...this.props} currentMessage={currentMessage} />
    )
  }
}
