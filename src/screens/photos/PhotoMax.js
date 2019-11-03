import React from 'react';

import Lightbox from 'react-native-lightbox';

class PhotoMax extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Lightbox navigator={navigator}>
        <Image
          style={{ height: 300 }}
          source={{ uri: this.props.navigation.state.params.photo }}
        />
      </Lightbox>
    )
  }
};

export default PhotoMax;
