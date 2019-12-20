import React from 'react';
import { Platform, StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';

import { Storage } from 'aws-amplify';

import { Avatar } from 'react-native-elements';

import S3Image from './S3Image'

import aws_exports from '../../aws-exports';

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

export default class AvatarS3Image extends React.Component {
  constructor(props) {
      super(props);

      const { source } = props;
      this.state = {
        source: source,
      };
  }

  componentDidUpdate(prevProps, prevState) {
    const { source } = this.props;
    if (source !== prevProps.source) {
      this.setState({
        source: source
      });
    }
  }

  render() {
    const { name, size, imgKey, level='public', identityId } = this.props;

    if (!this.state.source && !imgKey) {
      return (
        <Avatar
          containerStyle={this.props.containerStyle}
          size={size}
          rounded={this.props.rounded}
          icon={(!name) ? {name: "add-a-photo"} : null}
          title={(!this.state.source && name) ? __signature(name) : null}
          titleStyle={this.props.titleStyle}
          placeholderStyle={name ? {backgroundColor: __getColor(name)} : null}
          activeOpacity={0.2}
          editButton={this.props.editButton}
          onEditPress={this.props.onEditPress}
          showEditButton={this.props.showEditButton}
        />
      )
    }
    const width = (this.props.containerStyle && this.props.containerStyle.width) || (typeof size === 'number' ? size : avatarSizes[size] || avatarSizes.small);
    const height = (this.props.containerStyle && this.props.containerStyle.height) || width;

    return (
      <S3Image
        source={this.state.source}
        imgKey={imgKey}
        level={level}
        identityId={identityId}
        width={width}
        height={height}
        borderRadius={this.props.rounded ? (width/2) : null}
        rounded={this.props.rounded}
        editButton={this.props.editButton}
        onEditPress={this.props.onEditPress}
        showEditButton={this.props.showEditButton}
      />
    )
  }
}
