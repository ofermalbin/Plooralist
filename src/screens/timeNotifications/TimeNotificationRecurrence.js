import React from 'react';
import { View, Picker } from 'react-native';

import { ListItem } from  "react-native-elements";

//import { Picker } from '@react-native-community/picker';

import deepEqual from 'deep-equal';

import { find } from 'lodash';

import TimeNotificationRecurrenceText from './TimeNotificationRecurrenceText';
import TimeNotificationDtSendText from './TimeNotificationDtSendText';

import { timeNotificationStyles } from './config/stylesheets';

const Freqs = [
  {
    value: 1,
    recurrence: {freq: 3, interval: 1, count: 1, byweekday: null, bymonth: null},
    label: 'One Time'
  },
  {
    value: 2,
    recurrence: {freq: 4, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Hour'
  },
  {
    value: 3,
    recurrence: {freq: 4, interval: 2, count: null, byweekday: null, bymonth: null},
    label: 'Every 2 Hours'
  },
  {
    value: 4,
    recurrence: {freq: 3, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Day'
  },
  {
    value: 5,
    recurrence: {freq: 2, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Week'
  },
  {
    value: 6,
    recurrence: {freq: 2, interval: 2, count: null, byweekday: null, bymonth: null},
    label: 'Every 2 Weeks'
  },
  {
    value: 7,
    recurrence: {freq: 1, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Month'
  },
  {
    value: 8,
    recurrence: {freq: 0, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Year'
  },
  {
    value: 0,
    recurrence: null,
    label: 'Custom'
  },
];

class TimeNotificationRecurrence extends React.Component {

  constructor(props) {
    super(props);

    const defaultRecurrence = {freq: 3, interval: 1, count: 1, byweekday: null, bymonth: null};

    this.state = {
      recurrence: defaultRecurrence,
      value: 1,
      dtstart: null,
      show: false,
    }
  }

  componentDidMount() {
    this.setState({dtstart: this.props.dtstart});
    this.onRecurrenceChange(this.props.recurrence);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dtstart: nextProps.dtstart});
    !deepEqual(nextProps.recurrence, this.props.recurrence) && this.onRecurrenceChange(nextProps.recurrence)
  }

  onPickerValueChange(value) {
    const freq = find(Freqs, f => value && (f.value === value));
    if (freq) {
      this.onRecurrenceChange(freq.recurrence);
    }
    else {
      this.setState({value});
    }
  }

  onRecurrenceChange(recurrence) {
    let value;
    if(recurrence) {
      const freq = find(Freqs, f => deepEqual(f.recurrence, recurrence));
      if (freq) {
        value = freq.value;
      }
      else {
        value = 0;
      }
      this.setState({recurrence, value});
      this.props.onRecurrenceChange(recurrence);
    }
  }

  onRecurrenceCustomPress() {
    this.props.navigation.navigate('EditTimeNotificationRecurrenceCustom', {recurrence: this.state.recurrence, dtstart: this.state.dtstart, onRecurrenceChange: this.onRecurrenceChange.bind(this)});
  }

  render() {

    const { show, value } = this.state;

    return (
      <View>
        <ListItem
          bottomDivider={true}
          containerStyle={timeNotificationStyles.container}
          titleStyle={timeNotificationStyles.title}
          chevron={true}
          title='Recurrence'
          subtitle={<TimeNotificationRecurrenceText recurrence={this.state.recurrence} dtstart={this.state.dtstart} style={timeNotificationStyles.subtitle} />}
          onPress={() => this.setState({show: !this.state.show})}
        />
        {show && <Picker
          selectedValue={this.state.value}
          onValueChange={this.onPickerValueChange.bind(this)}
        >
          {Freqs.map((freq, i) => (
          <Picker.Item label={freq.label} value={freq.value} key={freq.value} />
        ))}
        </Picker>}
        {show && !value && <ListItem
            topDivider={true}
            bottomDivider={true}
            chevron={true}
            title='Custom Edit'
            onPress={this.onRecurrenceCustomPress.bind(this)}
          />
        }
      </View>
    )
  }
};

export default TimeNotificationRecurrence;
