import React from 'react';

import { View, Text, Alert } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listPlaceNotifications } from '../../graphql/queries';
import { onCreatePlaceNotification, onUpdatePlaceNotification , onDeletePlaceNotification } from '../../graphql/subscriptions';

import Loading from '../../components/Loading';

import { ListItem, Button, Icon, Divider } from 'react-native-elements';

import { infoListStyles } from './config/stylesheets';

import PlaceNotification from './PlaceNotification';

class PlaceNotifications extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { taskId } = this.props.navigation.state.params;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreatePlaceNotification), variables: {placeNotificationTaskId: taskId}},
        {query: gql(listPlaceNotifications), variables: {filter: {placeNotificationTaskId: {eq: taskId}}}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdatePlaceNotification), variables: {placeNotificationTaskId: taskId}},
        {query: gql(listPlaceNotifications), variables: {filter: {placeNotificationTaskId: {eq: taskId}}}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeletePlaceNotification), variables: {placeNotificationTaskId: taskId}},
        {query: gql(listPlaceNotifications), variables: {filter: {placeNotificationTaskId: {eq: taskId}}}}
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
            title='Place Notification'
            chevron={isOwner}
            rightTitle={(isOwner || null) && 'Add'}
            onPress={(isOwner || null) && this.onPlaceNotificationAddPress.bind(this) }
        />
        {placeNotifications.map((placeNotification, i) => ( <PlaceNotification {...this.props} key={placeNotification.id} placeNotification={placeNotification} isTaskOwner={this.props.isOwner} /> ))}
      </View>
    )
  }
};

export default compose(
  graphql(gql(listPlaceNotifications), {
    options: props => {
      const { task } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          filter: { placeNotificationTaskId: { eq: task.id }}
        }
      })
    },
    props: props => ({
      placeNotifications: props.data.listPlaceNotifications ? props.data.listPlaceNotifications.items : [],
      data: props.data
    }),
  }),
) (PlaceNotifications);
