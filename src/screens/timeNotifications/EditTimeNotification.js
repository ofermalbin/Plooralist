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
import { TimeNotificationDtSendText } from './TimeNotificationDtSentSendText';

import { listTimeNotificationsForTaskVariables } from './util';

import translations from '../../translations';

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

    const offline = Object.assign(timeNotification, {
      offline: true,
      nextSend: nextSend ? nextSend.toISOString() : null,
      dtstart: this.state.dtstart,
      ...this.state.recurrence,
      updatedAt: (new Date()).toISOString()
    });

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
      translations("TimeNotification.delete time notification"),
      translations("Common.Alert.are you sure?"),
      [
        {text: translations("Common.Button.cancel")},
        {text: translations("Common.Button.ok"), onPress: () => {
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
          title={translations("Common.Button.delete")}
          onPress={this.onDeletePress.bind(this)}
        />
        {nextSend && <View style={timeNotificationStyles.sendTextContainer}><TimeNotificationDtSendText style={timeNotificationStyles.sendText} date={nextSend} /></View>}
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
      headerTitle: translations("TimeNotification.time notification"),
      headerRight: () => <Button type="clear" title={translations("Common.Button.save")} titleStyle={{color: '#5fb8f6'}} onPress={() => params.onSavePress()} />,
      headerLeft: () => <Button type="clear" title={translations("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
