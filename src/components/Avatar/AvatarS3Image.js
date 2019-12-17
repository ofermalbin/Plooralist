import React from 'react';
import { Platform, StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';

import { Storage } from 'aws-amplify';

import { Avatar, Button, Icon } from 'react-native-elements';

import aws_exports from '../../aws-exports';

import FastImage from 'react-native-fast-image';
import URL from 'url';

const __signature = (full_name='') => {
  const name = full_name.toUpperCase().split(' ');
  let signature = '';
  if (name.length === 1) {
    signature = `${name[0].charAt(0)}`;
  } else if (name.length > 1) {
    signature = `${name[0].charAt(0)}${name[1].charAt(0)}`;
  }
  return signature;
}

const __getColor = (name='') => {
  let sumChars = 0;
  for (let i = 0; i < name.length; i += 1) {
    sumChars += name.charCodeAt(i);
  }

  // inspired by https://github.com/wbinnssmith/react-user-avatar
  // colors from https://flatuicolors.com/
  const colors = [
    '#e67e22', // carrot
    '#2ecc71', // emerald
    '#3498db', // peter river
    '#8e44ad', // wisteria
    '#e74c3c', // alizarin
    '#1abc9c', // turquoise
    '#2c3e50', // midnight blue
  ];
  return colors[sumChars % colors.length];
}

const avatarSizes = {
  small: 34,
  medium: 50,
  large: 75,
  xlarge: 150,
};

const defaultEditButton = {
  name: 'mode-edit',
  type: 'material',
  color: '#fff',
  underlayColor: '#000',
};

export default class AvatarS3Image extends React.Component {
  constructor(props) {
      super(props);

      const { source } = props;
      this.state = {
        source: source,
        query: null,
        loading: false
      };
  }

  async getImageSource() {
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

  async componentDidMount() {
    const { imgKey } = this.props;
    imgKey && await this.getImageSource();
  }

  async componentDidUpdate(prevProps, prevState) {
    const { imgKey, level, source } = this.props;
    if (source !== prevProps.source) {
      this.setState({
        source: source
      });
    }
    if (imgKey !== prevProps.imgKey) {
      imgKey ? await this.getImageSource() : this.setState({
        source: null,
        query: null
      });
    }
  }

  render() {
    const { name, size } = this.props;

      const width = typeof size === 'number' ? size : avatarSizes[size] || avatarSizes.small;
      const height = width;
      const titleSize = width / 2;
      const iconSize = width / 2;

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
        </TouchableHighlight> ||
        <ActivityIndicator animating={ this.state.loading } />
      );

    if (!this.state.source) {
      return (
        <Avatar
          containerStyle={this.props.containerStyle}
          size={size}
          rounded={this.props.rounded}
          //source={this.state.source}
          icon={(!name) ? {name: "add-a-photo"} : null}
          title={(!this.state.source && name) ? __signature(name) : null}
          titleStyle={this.props.titleStyle}
          placeholderStyle={(!this.state.source && name) ? {backgroundColor: __getColor(name)} : null}
          onPress={this.props.onPress ? () => this.props.onPress(this.state.source) : null}
          activeOpacity={0.2}
          editButton={this.props.editButton}
          onEditPress={this.props.onEditPress}
          showEditButton={this.props.showEditButton}
        />
      )
    }
    return (
      <FastImage
        source={{
          uri :this.state.source,
          //headers: this.state.query,
        }}
        //onError={(e) => alert(JSON.stringify(e.nativeEvent))}
        style={this.props.containerStyle ? this.props.containerStyle : {
          width: width,
          height: height,
          borderRadius: width/2
        }}
        onLoadStart={() => { this.setState({ loading: true })} }
        onLoadEnd={() => { this.setState({ loading: false })} }
      >
        {Utils}
      </FastImage>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  avatar: {
    flex: 1,
    width: null,
    height: null,
  },
  overlayContainer: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
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
