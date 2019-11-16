import React from 'react';

import { View, Text, Alert } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listTimeNotificationsForTask } from '../../graphql/queries';
import { onCreateTimeNotification, onUpdateTimeNotification , onDeleteTimeNotification } from '../../graphql/subscriptions';

import Loading from '../../components/Loading';

import { ListItem, Button, Icon, Divider } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

import TimeNotification from './TimeNotification';

class TimeNotifications extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { taskId } = this.props.navigation.state.params;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateTimeNotification), variables: {timeNotificationTaskId: taskId}},
        {query: gql(listTimeNotificationsForTask), variables: {timeNotificationTaskId: taskId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateTimeNotification), variables: {timeNotificationTaskId: taskId}},
        {query: gql(listTimeNotificationsForTask), variables: {timeNotificationTaskId: taskId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteTimeNotification), variables: {timeNotificationTaskId: taskId}},
        {query: gql(listTimeNotificationsForTask), variables: {timeNotificationTaskId: taskId}}
      )
    );
  }

  onTimeNotificationAddPress() {
    this.props.navigation.navigate('CreateTimeNotification', {task: this.props.task});
  }

  render() {

    const { timeNotifications, isOwner } = this.props;

    if (!timeNotifications && !isOwner) {
      return null;
    }

    return (
      <View>
        <ListItem
            topDivider={true}
            bottomDivider={true}
            containerStyle={[infoListStyles.container, {marginTop:22}]}
            titleStyle={infoListStyles.lightTitle}
            rightTitleStyle={infoListStyles.rightTitle}
            leftIcon={{ name: 'alarm', iconStyle: infoListStyles.leftIcon }}
            title='Time Notification'
            chevron={isOwner}
            rightTitle={(isOwner || null) && 'Add'}
            onPress={(isOwner || null) && this.onTimeNotificationAddPress.bind(this) }
        />
        {timeNotifications.map((timeNotification, i) => ( <TimeNotification {...this.props} key={timeNotification.id} timeNotification={timeNotification} isTaskOwner={this.props.isOwner} /> ))}
      </View>
    )
  }
};

export default compose(
  graphql(gql(listTimeNotificationsForTask), {
    options: props => {
      const { task } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          timeNotificationTaskId: task.id
        }
      })
    },
    props: props => ({
      timeNotifications: props.data.listTimeNotificationsForTask ? props.data.listTimeNotificationsForTask.items : [],
      data: props.data
    }),
  }),
) (TimeNotifications);
