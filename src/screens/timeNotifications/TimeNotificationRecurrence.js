import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { ListItem } from  "react-native-elements";

import TimeNotificationRecurrenceText from './TimeNotificationRecurrenceText';

import { timeNotificationStyles } from './config/stylesheets';

class TimeNotificationRecurrence extends React.Component {

  constructor(props) {
    super(props);

    const { recurrence, dtstart } = props;
    this.state = {
      recurrence: recurrence,
      dtstart: dtstart,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({recurrence: nextProps.recurrence, dtstart: nextProps.dtstart});
  }

  onRecurrenceChange(recurrence) {
    this.setState({recurrence: recurrence});
    this.props.onRecurrenceChange(recurrence);
  }

  onRecurrencePress() {
    this.props.navigation.navigate('EditTimeNotificationRecurrence', {recurrence: this.state.recurrence, dtstart: this.state.dtstart, onRecurrenceChange: this.onRecurrenceChange.bind(this)});
  }

  render() {

    return (
      <ListItem
        bottomDivider={true}
        containerStyle={timeNotificationStyles.container}
        titleStyle={timeNotificationStyles.title}
        chevron={true}
        title='Recurrence'
        subtitle={<TimeNotificationRecurrenceText recurrence={this.state.recurrence} dtstart={this.state.dtstart} style={timeNotificationStyles.subtitle} />}
        onPress={this.onRecurrencePress.bind(this)}
      />
    )
  }
};

export default TimeNotificationRecurrence;
