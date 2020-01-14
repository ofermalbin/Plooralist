import React from 'react';

import { View, Text, Alert } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listTimeNotificationsForTask } from '../../graphql/queries';
import { onCreateTimeNotification, onUpdateTimeNotification , onDeleteTimeNotification } from '../../graphql/subscriptions';

import { Loading, Chevron } from '../../components';

import { ListItem, Button, Icon, Divider } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

import TimeNotification from './TimeNotification';

import { listTimeNotificationsForTaskVariables } from './util';

import translations from '../../translations';

class TimeNotifications extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { task } = this.props;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateTimeNotification), variables: {timeNotificationTaskId: task.id}},
        {query: gql(listTimeNotificationsForTask), variables: listTimeNotificationsForTaskVariables(task.id)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateTimeNotification), variables: {timeNotificationTaskId: task.id}},
        {query: gql(listTimeNotificationsForTask), variables: listTimeNotificationsForTaskVariables(task.id)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteTimeNotification), variables: {timeNotificationTaskId: task.id}},
        {query: gql(listTimeNotificationsForTask), variables: listTimeNotificationsForTaskVariables(task.id)}
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
            title={translations('TimeNotification.time notifications')}
            chevron={isOwner && <Chevron />}
            rightTitle={(isOwner || null) && translations("Common.Button.add")}
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
        variables: listTimeNotificationsForTaskVariables(task.id)
      })
    },
    props: props => ({
      timeNotifications: props.data.listTimeNotificationsForTask ? props.data.listTimeNotificationsForTask.items : [],
      data: props.data
    }),
  }),
) (TimeNotifications);
