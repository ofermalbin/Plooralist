import React from 'react';

import { ScrollView, View, Text, Alert } from 'react-native';

import { ListItem, Button } from 'react-native-elements';

import RRule from 'rrule';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateTimeNotification, deleteTimeNotification } from '../../graphql/mutations';
import { listTimeNotificationsForTask } from '../../graphql/queries';

import TimeNotificationDtStart from './TimeNotificationDtStart';
import TimeNotificationRecurrence from './TimeNotificationRecurrence';
import TimeNotificationDtSendText from './TimeNotificationDtSendText';

import { listTimeNotificationsForTaskVariables } from './util';

import { timeNotificationStyles } from './config/stylesheets';

class EditTimeNotification extends React.Component {

  constructor(props) {
    super(props);

    const { timeNotification } = props.navigation.state.params;
    this.state = {
      dtstart: new Date(timeNotification.dtstart),
      recurrence: {
        freq: timeNotification.freq,
        interval: timeNotification.interval,
        byweekday: timeNotification.byweekday,
        bymonth: timeNotification.bymonth,
        count: timeNotification.count
      }
    }
    props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { task, timeNotification } = this.props.navigation.state.params;

    const now = new Date();

    let nextSend = null;
    if(!task.completed) {
      const rrule = new RRule(Object.assign({}, {dtstart: this.state.dtstart}, this.state.recurrence));
      nextSend = rrule.after(now, true);
    }

    const input = {
      id: timeNotification.id,
      nextSend: nextSend ? nextSend.toISOString() : null,
      dtstart: this.state.dtstart,
      ...this.state.recurrence,
      expectedVersion: timeNotification.version
    };

    const offline = Object.assign(timeNotification, {offline: true, updatedAt: (new Date()).toISOString()});

    this.props.updateTimeNotification({...offline, input});
    this.props.navigation.goBack();
  }

  onDtstartChange(dtstart) {
    this.setState({dtstart: dtstart});
  }

  onRecurrenceChange(recurrence) {
    this.setState({recurrence: recurrence});
  }

  onDeletePress() {

    Alert.alert(
      'Delete Time Notification',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          const { timeNotification } = this.props.navigation.state.params;
          const input = {
            id: timeNotification.id,
            expectedVersion: timeNotification.version
          };
          const offline = Object.assign(timeNotification, {offline: true});
          this.props.deleteTimeNotification({...offline, input});
          this.props.navigation.goBack();
        }},
      ]
    )
  }

  render() {
    const { task, timeNotification } = this.props.navigation.state.params;
    const now = new Date();
    let nextSend = null;
    if(!task.completed) {
      const rrule = new RRule(Object.assign({}, {dtstart: this.state.dtstart}, this.state.recurrence));
      nextSend = rrule.after(now, true);
    }

    return (
      <ScrollView>
      <View style={{ marginTop: 22 }}>
        <TimeNotificationDtStart recurrence={this.state.recurrence} dtstart={this.state.dtstart} onDtstartChange={this.onDtstartChange.bind(this)}/>
        <TimeNotificationRecurrence navigation={this.props.navigation} recurrence={this.state.recurrence} dtstart={this.state.dtstart} onRecurrenceChange={this.onRecurrenceChange.bind(this)}/>
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={[timeNotificationStyles.container, { marginTop:22 }]}
          titleStyle={[timeNotificationStyles.title, timeNotificationStyles.removeText]}
          chevron={false}
          title='Delete'
          onPress={this.onDeletePress.bind(this)}
        />
        {nextSend && <TimeNotificationDtSendText style={timeNotificationStyles.sendText} date={nextSend} />}
      </View>
      </ScrollView>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateTimeNotification), variables => ({ query: gql(listTimeNotificationsForTask), variables: listTimeNotificationsForTaskVariables(variables.timeNotificationTaskId)}), 'TimeNotification'),
  graphqlMutation(gql(deleteTimeNotification), variables => ({ query: gql(listTimeNotificationsForTask), variables: listTimeNotificationsForTaskVariables(variables.timeNotificationTaskId)}), 'TimeNotification')
) (EditTimeNotification)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Time Nonification",
      headerRight: <Button type="clear" title="Save" titleStyle={{color: '#5fb8f6'}} onPress={() => params.onSavePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
