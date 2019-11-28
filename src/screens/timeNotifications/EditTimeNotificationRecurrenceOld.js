import React from 'react';

import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';

import { normalize, colors, Button, ListItem } from  "react-native-elements";

import deepEqual from 'deep-equal';

import TimeNotificationRecurrenceText from './TimeNotificationRecurrenceText';
import TimeNotificationDtSendText from './TimeNotificationDtSendText';

import { timeNotificationStyles } from './config/stylesheets';

const Freqs = [
  {
    value: {freq: 3, interval: 1, count: 1, byweekday: null, bymonth: null},
    label: 'One Time'
  },
  {
    value: {freq: 4, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Hour'
  },
  {
    value: {freq: 4, interval: 2, count: null, byweekday: null, bymonth: null},
    label: 'Every 2 Hours'
  },
  {
    value: {freq: 3, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Day'
  },
  {
    value: {freq: 2, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Week'
  },
  {
    value: {freq: 2, interval: 2, count: null, byweekday: null, bymonth: null},
    label: 'Every 2 Weeks'
  },
  {
    value: {freq: 1, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Month'
  },
  {
    value: {freq: 0, interval: 1, count: null, byweekday: null, bymonth: null},
    label: 'Every Year'
  },
];

class EditTimeNotificationRecurrence extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Time Nonification",
        headerRight: <Button type="clear" title="Done" titleStyle={{color: '#5fb8f6'}} onPress={() => params.onDonePress()} />,
        headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    const { recurrence, dtstart } = props.navigation.state.params;;
    this.state = {
      recurrence: recurrence,
      dtstart: dtstart,
    }

    this.isCustom = this.isCustom.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onDonePress: this.onDonePress.bind(this) });
  }

  onDonePress() {
    const { onRecurrenceChange } = this.props.navigation.state.params;
    onRecurrenceChange(this.state.recurrence);
    this.props.navigation.goBack();
  }

  onRecurrenceChange(recurrence) {
    this.setState({recurrence: recurrence});
  }

  isCustom() {
    return (this.state.recurrence && (Freqs.findIndex(freq => deepEqual(freq.value, this.state.recurrence)) == -1));
  }

  onRecurrencePress() {
    this.props.navigation.navigate('EditTimeNotificationRecurrenceCustom', {recurrence: this.state.recurrence, dtstart: this.state.dtstart, onRecurrenceChange: this.onRecurrenceChange.bind(this)});
  }

  render() {

    return (
      <ScrollView>
        <View>
          {Freqs.map((freq, i) => (
          <ListItem
            //topDivider={true}
            key={i}
            bottomDivider={true}
            chevron={false}
            title={freq.label}
            checkmark={deepEqual(freq.value, this.state.recurrence)}
            onPress={this.onRecurrenceChange.bind(this, freq.value)}
          />))}
          <View style={{ marginTop: 10, marginBottom: 40 }}>
            <ListItem
              topDivider={true}
              bottomDivider={true}
              chevron={true}
              title='Custom'
              checkmark={this.isCustom()}
              onPress={this.onRecurrencePress.bind(this)}
            />
            {(this.isCustom() || null) && <TimeNotificationRecurrenceText style={timeNotificationStyles.recurrenceText} recurrence={this.state.recurrence} dtstart={this.state.dtstart} />}
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default EditTimeNotificationRecurrence;
