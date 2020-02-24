import React from 'react';
import { Platform, StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';

import { Button, Icon } from 'react-native-elements';

import aws_exports from '../../aws-exports';

import FastImage from 'react-native-fast-image';

const defaultEditButton = {
  name: 'mode-edit',
  type: 'material',
  color: '#fff',
  underlayColor: '#000',
};

export default class S3Image extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        source: props.source,
        loading: false
      };
  }

  getImageSource() {
    const { imgKey, level='public', identityId } = this.props;
    const uri = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/${level}/${(level != 'public') ? identityId : ''}${(level != 'public') ? '/' : ''}${imgKey}`;
    /*const params = Object.assign({}, {level: level}, (level === 'protected') && {identityId: identityId});
    await Storage.get(imgKey, params)
      .then(presignedUrl => {
        const url = URL.parse(presignedUrl, true);
        const uri = url.href.split('?')[0];
        this.setState({
            source: uri,
            query: url.query
        });
      })
      .catch(err => alert(err));*/
    this.setState({
        source: uri,
    });
  }

  componentDidMount() {
    const { imgKey } = this.props;
    imgKey && this.getImageSource();
  }

  componentDidUpdate(prevProps, prevState) {
    const { imgKey, source } = this.props;
    if (source !== prevProps.source) {
      this.setState({
        source: source
      });
    }
    if (imgKey !== prevProps.imgKey) {
      imgKey ? this.getImageSource() : this.setState({
        source: null
      });
    }
  }

  render() {
    const { width, height, borderRadius, margin, resizeMode } = this.props;

    const editButton = {
      ...defaultEditButton,
      ...this.props.editButton,
    };
    const editButtonSize = editButton.size || (width + height) / 2 / 3;

    const Utils = this.props.showEditButton && (
      <TouchableHighlight
        style={StyleSheet.flatten([
          styles.editButton,
          {
            width: editButtonSize,
            height: editButtonSize,
            borderRadius: editButtonSize / 2,
          },
          editButton.style,
        ])}
        underlayColor={editButton.underlayColor}
        onPress={this.props.onEditPress}
      >
        <View>
          <Icon size={editButtonSize * 0.8} {...editButton} />
        </View>
      </TouchableHighlight>
    );

    return (
      this.state.source && <FastImage
          source={{
            uri: this.state.source,
            //headers: this.state.query,
          }}
          //onError={(e) => alert(JSON.stringify(e.nativeEvent))}
          style={{
            width: width,
            height: height,
            borderRadius: borderRadius,
            margin: margin,
            resizeMode: resizeMode,
          }}
          onLoadStart={() => { this.setState({ loading: true })} }
          onLoadEnd={() => { this.setState({ loading: false })} }
        >
          {Utils}
      </FastImage> || null
    )
  }
}

const styles = StyleSheet.create({
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aaa',
    ...Platform.select({
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.5,
      },
    }),
  },
});
