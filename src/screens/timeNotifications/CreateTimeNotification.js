import React from 'react';

import { View } from 'react-native';

import { ListItem, Button } from 'react-native-elements';

import RRule from 'rrule';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { createTimeNotification } from '../../graphql/mutations';
import { listTimeNotificationsForTask } from '../../graphql/queries';

import uuid from 'react-native-uuid';

import TimeNotificationDtStart from './TimeNotificationDtStart';
import TimeNotificationRecurrence from './TimeNotificationRecurrence';

import { listTimeNotificationsForTaskVariables } from './util';

import { timeNotificationStyles } from './config/stylesheets';

class CreateTimeNotification extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Time Nonification",
        headerRight: <Button type="clear" title="Add" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
        headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      dtstart: now,
      recurrence: {
        freq: 3,
        interval: 1,
        byweekday: null,
        bymonth: null,
        count: 1
      }
    }
    props.navigation.setParams({disabled:false, onAddPress: this.onAddPress.bind(this)});
  }

  onAddPress() {
    const { task } = this.props.navigation.state.params;
    const now = new Date();

    let nextSend = null;
    if(!task.completed) {
      const rrule = new RRule(Object.assign({}, {dtstart: this.state.dtstart}, this.state.recurrence));
      nextSend = rrule.after(now, true);
    }

    const input = {
      id: uuid.v4(),
      timeNotificationTaskId: task.id,
      lastSend: null,
      nextSend: nextSend ? nextSend.toISOString() : null,
      dtstart: this.state.dtstart,
      ...this.state.recurrence
    };

    const offline = {
      ...input,
      offline: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    this.props.createTimeNotification({...offline, input: input});
    this.props.navigation.goBack();

    //const now = new Date();
    //const { task } = this.props.navigation.state.params;
    //let nextSend = null;
    //if(!task.completed) {
      //const rrule = new RRule(Object.assign({}, {dtstart: this.state.dtstart}, this.state.recurrence));
      //nextSend = rrule.after(now, true);
    //}
    //this.props.createTimeNotification({input: Object.assign({taskId: task.id, offline: true, lastSend: null}, {nextSend: nextSend ? nextSend.toISOString() : null}, {dtstart: this.state.dtstart}, this.state.recurrence, {updatedAt: now.toISOString()})});
  }

  onDtstartChange(dtstart) {
    this.setState({dtstart: dtstart});
  }

  onRecurrenceChange(recurrence) {
    this.setState({recurrence: recurrence});
  }

  render() {

    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
        <TimeNotificationDtStart recurrence={this.state.recurrence} dtstart={this.state.dtstart} onDtstartChange={this.onDtstartChange.bind(this)}/>
        <TimeNotificationRecurrence navigation={this.props.navigation} recurrence={this.state.recurrence} dtstart={this.state.dtstart} onRecurrenceChange={this.onRecurrenceChange.bind(this)}/>
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(createTimeNotification), variables => ({query: gql(listTimeNotificationsForTask), variables: listTimeNotificationsForTaskVariables(variables.timeNotificationTaskId)}), 'TimeNotification')
) (CreateTimeNotification)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Time Nonification",
      headerRight: <Button type="clear" title="Add" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
