import React from 'react';

import { View, Text, Alert } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listPlaceNotificationsForTask } from '../../graphql/queries';
import { onCreatePlaceNotification, onUpdatePlaceNotification , onDeletePlaceNotification } from '../../graphql/subscriptions';

import { Loading, Chevron } from '../../components';

import { ListItem, Button, Icon, Divider } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

import PlaceNotification from './PlaceNotification';

import { listPlaceNotificationsForTaskVariables } from './util';

import translations from '../../translations';

class PlaceNotifications extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { task } = this.props;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreatePlaceNotification), variables: {placeNotificationTaskId: task.id}},
        {query: gql(listPlaceNotificationsForTask), variables: listPlaceNotificationsForTaskVariables(task.id)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdatePlaceNotification), variables: {placeNotificationTaskId: task.id}},
        {query: gql(listPlaceNotificationsForTask), variables: listPlaceNotificationsForTaskVariables(task.id)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeletePlaceNotification), variables: {placeNotificationTaskId: task.id}},
        {query: gql(listPlaceNotificationsForTask), variables: listPlaceNotificationsForTaskVariables(task.id)}
      )
    );
  }

  onPlaceNotificationAddPress() {
    this.props.navigation.navigate('CreatePlaceNotification', {task: this.props.task});
  }

  render() {

    const { placeNotifications, isOwner } = this.props;

    if (!placeNotifications && !isOwner) {
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
            leftIcon={{ name: 'place', iconStyle: infoListStyles.leftIcon }}
            title={translations('PlaceNotification.place notifications')}
            chevron={isOwner && <Chevron />}
            rightTitle={(isOwner || null) && translations("Common.Button.add")}
            onPress={(isOwner || null) && this.onPlaceNotificationAddPress.bind(this) }
        />
        {placeNotifications.map((placeNotification, i) => ( <PlaceNotification {...this.props} key={placeNotification.id} placeNotification={placeNotification} isTaskOwner={this.props.isOwner} /> ))}
      </View>
    )
  }
};

export default compose(
  graphql(gql(listPlaceNotificationsForTask), {
    options: props => {
      const { task } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: listPlaceNotificationsForTaskVariables(task.id)
      })
    },
    props: props => ({
      placeNotifications: props.data.listPlaceNotificationsForTask ? props.data.listPlaceNotificationsForTask.items : [],
      data: props.data
    }),
  }),
) (PlaceNotifications);
