import React from 'react';
import { Platform, I18nManager } from 'react-native';

import { Icon } from 'react-native-elements';

const chevronDefaultProps = {
  type: Platform.OS === 'ios' ? 'ionicon' : 'material',
  color: '#D1D1D6',
  name: Platform.OS === 'ios' ? (I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward') : (I18nManager.isRTL ? 'keyboard-arrow-left' : 'keyboard-arrow-right'),
  size: 16,
};

export default class Chevron extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <Icon {...chevronDefaultProps} />
    );
  }
}
