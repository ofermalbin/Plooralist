import React from 'react';
import { Text } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

const getDayFormat = (day) => {

  let now = new Date();
  let dayFormat = 'dddd';

  if (moment(now).diff(day, 'days') == 1) {
    dayFormat = '[Yesterday]'
  }
  else if (moment(now).startOf('date').isSame(moment(day).startOf('date'), 'day')) {
    dayFormat = '[Today]'
  }
  else if (moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') == 1) {
    dayFormat = '[Tomorrow]'
  }
  else if ((moment(now).startOf('date').diff(moment(day).startOf('date'), 'days') <= 7) && (moment(now).startOf('date').diff(moment(day).startOf('date'), 'days') > 0)) {
    dayFormat = '[Last] dddd'
  }
  else if ((moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') <= 7 ) && (moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') > 0 )) {
    dayFormat = '[Next] dddd'
  }
  else {
    dayFormat = 'dddd, ll'
  }

  return (dayFormat);
}

class TimeNotificationDtSendText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { date } = this.props;
    return (
      <Text style={this.props.style}>{moment(date).locale('en').format(`${getDayFormat(date)}${'[ at] LT'}`)}</Text>
    )
  }
};

export default TimeNotificationDtSendText;
