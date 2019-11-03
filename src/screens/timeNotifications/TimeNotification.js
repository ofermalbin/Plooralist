import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, Alert } from 'react-native';

import { pick } from 'lodash';

import Loading from '../../components/Loading';

import { ListItem, Button, Icon, Divider } from 'react-native-elements';

import TimeNotificationDtStartText from './TimeNotificationDtStartText';
import TimeNotificationRecurrenceText from './TimeNotificationRecurrenceText';
import TimeNotificationDtSendText from './TimeNotificationDtSendText';

import { timeNotificationStyles } from './config/stylesheets';

class TimeNotification extends React.Component {

  constructor(props) {
    super(props);
  }

  onTimeNotificationPress() {
    const { task, timeNotification } = this.props;
    this.props.navigation.navigate('EditTimeNotification', {task: task, timeNotification: timeNotification});
  }

  onTestPress() {
    const { task, timeNotification } = this.props;
    //Todo
  }

  render() {

    const { task, isTaskOwner, timeNotification } = this.props;

    if (!timeNotification && !isTaskOwner) {
      return <Loading />;
    }

    return (
      <ListItem
        bottomDivider={true}
        containerStyle={timeNotificationStyles.container}
        titleStyle={timeNotificationStyles.notificationText}
        subtitleStyle={timeNotificationStyles.notificationText}
        chevron={isTaskOwner}
        bottomDivider={true}
        containerStyle={timeNotificationStyles.container}
        title=<TimeNotificationDtStartText {...timeNotification} style={timeNotificationStyles.notificationText} />
        subtitle=
          <View>
            <TimeNotificationRecurrenceText recurrence={pick(timeNotification, ['freq', 'interval', 'count', 'byweekday', 'bymonth', 'until'])} dtstart={new Date(timeNotification.dtstart)} style={timeNotificationStyles.notificationText} />
            {!task.completed && timeNotification.lastSend && <TimeNotificationDtSendText style={timeNotificationStyles.recurrenceText} date={timeNotification.lastSend} />}
            {!task.completed && timeNotification.nextSend && <TimeNotificationDtSendText style={timeNotificationStyles.recurrenceText} date={timeNotification.nextSend} />}
          </View>
        onLongPress={isTaskOwner ? this.onTestPress.bind(this) : null}
        onPress={isTaskOwner ? this.onTimeNotificationPress.bind(this) : null}
      />
    )
  }
}

export default TimeNotification;
