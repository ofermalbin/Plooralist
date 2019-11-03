import React from 'react';
import { Text } from 'react-native';

import RRule from 'rrule';

import deepEqual from 'deep-equal';

const Freqs = [
  {
    value: {freq: 3, interval: 1, count: 1, byweekday: null, bymonth: null, until: null},
    label: 'One Time'
  },
  {
    value: {freq: 4, interval: 1, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every Hour'
  },
  {
    value: {freq: 4, interval: 2, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every 2 Hours'
  },
  {
    value: {freq: 3, interval: 1, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every Day'
  },
  {
    value: {freq: 2, interval: 1, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every Week'
  },
  {
    value: {freq: 2, interval: 2, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every 2 Weeks'
  },
  {
    value: {freq: 1, interval: 1, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every Month'
  },
  {
    value: {freq: 0, interval: 1, count: null, byweekday: null, bymonth: null, until: null},
    label: 'Every Year'
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
