import React from 'react';
import { Text } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import translate, { getI18nConfig } from '../../translations';

class TimeNotificationDtStartText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { languageTag, isRTL } = getI18nConfig();
    const { dtstart } = this.props;
    return (
      <Text style={this.props.style}>{moment(dtstart).locale(languageTag).format('LLLL')}</Text>
    )
  }
};

export default TimeNotificationDtStartText;
