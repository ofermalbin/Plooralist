import React from 'react';
import { Text } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import translates, { getI18nConfig } from '../../translations';

const getDayFormat = (day) => {

  let now = new Date();
  let dayFormat = 'dddd';

  if (moment(now).diff(day, 'days') == 1) {
    dayFormat = `[${translates('TimeNotification.yesterday')}]`
  }
  else if (moment(now).startOf('date').isSame(moment(day).startOf('date'), 'day')) {
    dayFormat = `[${translates('TimeNotification.today')}]`
  }
  else if (moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') == 1) {
    dayFormat = `[${translates('TimeNotification.tomorrow')}]`
  }
  else if ((moment(now).startOf('date').diff(moment(day).startOf('date'), 'days') <= 7) && (moment(now).startOf('date').diff(moment(day).startOf('date'), 'days') > 0)) {
    dayFormat = `[${translates('TimeNotification.last')}] dddd`
  }
  else if ((moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') <= 7 ) && (moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') > 0 )) {
    dayFormat = `[${translates('TimeNotification.next')}] dddd`
  }
  else {
    dayFormat = `[${translates('TimeNotification.at day')}] dddd, ll`
  }

  return (dayFormat);
}

class TimeNotificationDtSentText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { languageTag, isRTL } = getI18nConfig();
    const { date } = this.props;
    return (
      <Text style={this.props.style}>{moment(date).locale(languageTag).format(`[${translates('TimeNotification.sent')} ]${getDayFormat(date)} [${translates('TimeNotification.at hour')}] LT`)}</Text>
    )
  }
};

class TimeNotificationDtSendText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { languageTag, isRTL } = getI18nConfig();
    const { date } = this.props;
    return (
      <Text style={this.props.style}>{moment(date).locale(languageTag).format(`[${translates('TimeNotification.send')} ]${getDayFormat(date)} [${translates('TimeNotification.at hour')}] LT`)}</Text>
    )
  }
};

export  { TimeNotificationDtSentText, TimeNotificationDtSendText };
