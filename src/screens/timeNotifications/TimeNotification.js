import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, Alert } from 'react-native';

import { pick } from 'lodash';

import { Loading, Chevron } from '../../components';

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
        titleStyle={timeNotificationStyles.title}
        subtitleStyle={timeNotificationStyles.subtitle}
        chevron={isTaskOwner && <Chevron />}
        bottomDivider={true}
        containerStyle={timeNotificationStyles.container}
        title=<TimeNotificationDtStartText {...timeNotification} style={timeNotificationStyles.title} />
        subtitle=
          <View>
            <TimeNotificationRecurrenceText recurrence={pick(timeNotification, ['freq', 'interval', 'count', 'byweekday', 'bymonth'])} dtstart={new Date(timeNotification.dtstart)} style={timeNotificationStyles.notificationText} />
            {!task.completed && timeNotification.lastSend && <TimeNotificationDtSendText style={timeNotificationStyles.sendText} date={timeNotification.lastSend} />}
            {!task.completed && timeNotification.nextSend && <TimeNotificationDtSendText style={timeNotificationStyles.sendText} date={timeNotification.nextSend} />}
          </View>
        onLongPress={isTaskOwner ? this.onTestPress.bind(this) : null}
        onPress={isTaskOwner ? this.onTimeNotificationPress.bind(this) : null}
        disabled={timeNotification.offline}
        disabledStyle={{backgroundColor: '#F0F8FF'}}
      />
    )
  }
}

export default TimeNotification;
