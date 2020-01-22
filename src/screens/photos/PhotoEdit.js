import { Alert } from 'react-native';

import ImagePicker from 'react-native-image-picker';

import translate from '../../translations';

const defaultOptions = {
  takePhotoButtonTitle: translate("Common.Photo.take photo"),
  chooseFromLibraryButtonTitle: translate("Common.Photo.choose photo from library"),
  cancelButtonTitle: translate("Common.Button.cancel"),
  quality: 1,
  maxWidth: 300,
  maxHeight: 300,
  allowsEditing: true,
  storageOptions: {
    skipBackup: true
  },
  cameraType: 'back',
};

const PhotoEdit = (props) => {

  const photoEditOptions = {
    title: translate(props.photo ? "Common.Photo.update photo picker" : "Common.Photo.add photo picker"),
    customButtons: props.photo ? [{ title: translate("Common.Photo.remove photo"), name: 'remove' }] : [],
  }

  const options = Object.assign({}, defaultOptions, photoEditOptions, props.options);

  ImagePicker.showImagePicker(options, (response) => {

    if (response.didCancel) {
    }
    else if (response.error) {
      Alert.alert('PhotoPicker Error', response.error);
    }
    else if (response.customButton) {
      if (response.customButton === 'remove') {
        props.removePhoto();
      }
    }
    else {
      //props.updatePhoto(`${("data:image/jpeg;base64,")}${response.data}`);
      //props.updatePhoto(response.data);
      props.updatePhoto(response.uri);
    }
  });
};

const launchCamera = (props) => {

  const options = Object.assign({}, defaultOptions, props.options);

  ImagePicker.launchCamera(options, (response)  => {
    if (response.didCancel) {
    }
    else if (response.error) {
      Alert.alert('PhotoPicker Error', response.error);
    }
    else {
      props.updatePhoto(response.uri);
    }
  });
}

const launchImageLibrary = (props) => {

  const options = Object.assign({}, defaultOptions, props.options);

  ImagePicker.launchImageLibrary(options, (response)  => {
    if (response.didCancel) {
    }
    else if (response.error) {
      Alert.alert('PhotoPicker Error', response.error);
    }
    else {
      props.updatePhoto(response.uri);
    };
  });
}

export { PhotoEdit, launchCamera, launchImageLibrary };
