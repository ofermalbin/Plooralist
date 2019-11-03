import { Alert } from 'react-native';

import ImagePicker from 'react-native-image-picker';

const defaultOptions = {
  takePhotoButtonTitle: 'Take Photo...',
  chooseFromLibraryButtonTitle: 'Choose from Library...',
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
    title: props.photo ? 'Update Photo Picker' : 'Add Photo Picker',
    customButtons: props.photo ? [{ title: 'Remove Photo...', name: 'remove' }] : [],
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
