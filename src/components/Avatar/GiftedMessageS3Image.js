import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Storage } from 'aws-amplify';

import aws_exports from '../../aws-exports';

import FastImage from 'react-native-fast-image';
import URL from 'url';

export default class GiftedMessageS3Image extends React.Component {
  constructor(props) {
      super(props);

      const { currentMessage } = props;
      this.state = {
        source: currentMessage.uri,
        loading: false
      };
  }

  getImageSource() {
    const { currentMessage, level='public' } = this.props;
    const uri = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/${level}/${currentMessage.imgKey}`;
    this.setState({
        source: uri,
    });
  }

  componentDidMount() {
    const { currentMessage } = this.props;
    currentMessage.imgKey && this.getImageSource();
  }

  render() {

    const Utils = <ActivityIndicator animating={ this.state.loading } />;

    return (
      <FastImage
        source={{
          uri :this.state.source,
          //headers: this.state.query,
        }}
        //onError={(e) => alert(JSON.stringify(e.nativeEvent))}
        style={this.props.containerStyle ? this.props.containerStyle : {
          width: 150,
          height: 100,
          borderRadius: 13,
          margin: 3,
          resizeMode: 'cover',
        }}
        onLoadStart={() => { this.setState({ loading: true })} }
        onLoadEnd={() => { this.setState({ loading: false })} }
      >
        {Utils}
      </FastImage>
    )
  }
}
