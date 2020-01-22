import React from 'react';
import { Text } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import translate, { getI18nConfig } from '../../translations';

const getDayFormat = (day) => {

  let now = new Date();
  let dayFormat = 'dddd';

  const { languageTag, isRTL } = getI18nConfig();

  if (moment(now).diff(day, 'days') == 1) {
    dayFormat = `[${translate('TimeNotification.yesterday')}]`
  }
  else if (moment(now).startOf('date').isSame(moment(day).startOf('date'), 'day')) {
    dayFormat = `[${translate('TimeNotification.today')}]`
  }
  else if (moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') == 1) {
    dayFormat = `[${translate('TimeNotification.tomorrow')}]`
  }
  else if ((moment(now).startOf('date').diff(moment(day).startOf('date'), 'days') <= 7) && (moment(now).startOf('date').diff(moment(day).startOf('date'), 'days') > 0)) {
    dayFormat = isRTL ? `[${translate('TimeNotification.at day')}] dddd [${translate('TimeNotification.last')}]` : `[${translate('TimeNotification.at day')} ${translate('TimeNotification.last')}] dddd`
  }
  else if ((moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') <= 7 ) && (moment(day).startOf('date').diff(moment(now).startOf('date'), 'days') > 0 )) {
    dayFormat = isRTL ? `[${translate('TimeNotification.at day')}] dddd [${translate('TimeNotification.next')}]` : `[${translate('TimeNotification.at day')} ${translate('TimeNotification.next')}] dddd`
  }
  else {
    dayFormat = `[${translate('TimeNotification.at day')}] dddd, ll`
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
      <Text style={this.props.style}>{moment(date).locale(languageTag).format(`[${translate('TimeNotification.sent')} ]${getDayFormat(date)} [${translate('TimeNotification.at hour')}] LT`)}</Text>
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
      <Text style={this.props.style}>{moment(date).locale(languageTag).format(`[${translate('TimeNotification.send')} ]${getDayFormat(date)} [${translate('TimeNotification.at hour')}] LT`)}</Text>
    )
  }
};

export  { TimeNotificationDtSentText, TimeNotificationDtSendText };
