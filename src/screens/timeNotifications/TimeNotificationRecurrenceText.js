import React from 'react';
import { Text } from 'react-native';

import RRule from 'rrule';

import deepEqual from 'deep-equal';

import translates from '../../translations';

const Freqs = [
  {
    value: {freq: 3, interval: 1, count: 1, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.one time")
  },
  {
    value: {freq: 4, interval: 1, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every hour")
  },
  {
    value: {freq: 4, interval: 2, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every 2 hours")
  },
  {
    value: {freq: 3, interval: 1, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every day")
  },
  {
    value: {freq: 2, interval: 1, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every week")
  },
  {
    value: {freq: 2, interval: 2, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every 2 weeks")
  },
  {
    value: {freq: 1, interval: 1, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every month")
  },
  {
    value: {freq: 0, interval: 1, count: null, byweekday: null, bymonth: null},
    label: translates("TimeNotification.Recurrence.every year")
  },
];

class TimeNotificationRecurrenceText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { recurrence, dtstart } = this.props;
    let recurrenceText;

    const freqsIndex = Freqs.findIndex(freq => deepEqual(freq.value, recurrence));

    if (freqsIndex == -1) {
      const rule = new RRule(Object.assign({}, recurrence, {dtstart: dtstart}));
      recurrenceText = rule.toText();
    }
    else {
      recurrenceText = Freqs[freqsIndex].label;
    }
    return (
      <Text style={this.props.style}>{recurrenceText}</Text>
    )
  }
};

export default TimeNotificationRecurrenceText;
