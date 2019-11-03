import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment/min/moment-with-locales.js';

class TimeNotificationDtStartText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { dtstart } = this.props;
    return (
      <Text style={this.props.style}>{moment(dtstart).locale('en').format('LLLL')}</Text>
    )
  }
};

export default TimeNotificationDtStartText;
