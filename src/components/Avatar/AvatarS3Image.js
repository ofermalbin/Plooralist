import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Storage } from 'aws-amplify';

import { Avatar } from 'react-native-elements';

import FastImage from 'react-native-fast-image';

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

export default class AvatarS3Image extends React.Component {
  constructor(props) {
      super(props);

      this.state = { source: null };
  }

  getImageSource() {
    const { imgKey, level } = this.props;
    /*await Storage.get(imgKey, {level : level? level : 'public'})
      .then(url => {
        this.setState({
            source: { uri: url }
        });
      })
      .catch(err => alert(err));*/
      this.setState({
        source: { uri: imgKey }
        //source: { uri: `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${imgKey}` }
      });
  }

  componentDidMount() {
    const { imgKey, source } = this.props;
    this.setState({
      source: source ? { uri: source } : null
    });
    imgKey && this.getImageSource();
  }

  componentDidUpdate(prevProps, prevState) {
    const { imgKey, source } = this.props;
    if (source !== prevProps.source) {
      this.setState({
        source: source ? { uri: source } : null
      });
    }
    if (imgKey !== prevProps.imgKey) {
      imgKey ? this.getImageSource() : this.setState({
        source: null
      });
    }
  }

  render() {
    const { name, onPress, editButton, showEditButton } = this.props;
    if (!this.state.source) {
      return (
        <Avatar
          containerStyle={this.props.containerStyle}
          rounded={this.props.rounded}
          icon={(!name) ? {name: "add-a-photo"} : null}
          title={name ? __signature(name) : null}
          titleStyle={this.props.titleStyle}
          placeholderStyle={name ? {backgroundColor: __getColor(name)} : null}
          onPress={onPress ? () => onPress(this.state.source) : null}
          editButton={editButton}
          showEditButton={showEditButton}
        />
      )
    }
    return (
      <FastImage
        source={this.state.source}
        onError={(e) => alert(JSON.stringify(e.nativeEvent))}
        style={this.props.containerStyle}
      />
    )
  }
}
