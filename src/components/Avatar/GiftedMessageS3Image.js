import React from 'react';
import { Storage } from 'aws-amplify';

import { MessageImage } from 'react-native-gifted-chat';

export default class GiftedMessageS3Image extends React.Component {
  constructor(props) {
      super(props);

      this.state = { source: null };
  }

  componentDidMount() {
    const { imgKey } = this.props.currentMessage;
    imgKey && this.getImageSource(imgKey);
  }

  getImageSource(imgKey) {
    Storage.get(imgKey, { level : 'public'})
      .then(url => {
        //alert(url);
        this.setState({ source: url });
      })
      .catch(err => alert(err));
  }

  render() {
    const currentMessage = Object.assign({}, this.props.currentMessage, this.state.source && {image: this.state.source});
    return (
      <MessageImage {...this.props} currentMessage={currentMessage} />
    )
  }
}
