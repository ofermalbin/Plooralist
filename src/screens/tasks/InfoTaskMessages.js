import React from 'react';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { listMessagesForTask } from '../../graphql/queries';

import { onCreateTaskMessage, onUpdateTaskMessage, onDeleteTaskMessage } from '../../graphql/subscriptions';

import { filter, orderBy } from 'lodash';

import { ListItem } from 'react-native-elements';

import { infoTaskStyles } from './config/stylesheets';

import { S3Image, Chevron } from '../../components';

import { listMessagesForTaskVariables } from './util';

import translate from '../../translations';

class InfoTaskMessages extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { taskId } = this.props;
    this.props.messagesData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(taskId)}
      )
    );
    this.props.messagesData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(taskId)}
      )
    );
    this.props.messagesData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteTaskMessage), variables: {messageTaskId: taskId}},
        {query: gql(listMessagesForTask), variables: listMessagesForTaskVariables(taskId)}
      )
    );
  }

  onPress() {
    const { taskId, panelId } = this.props;
    this.props.navigation.navigate('TaskMessages', {taskId, panelId});
  }

  render() {
    const { isOwner, messages } = this.props;
    const messagesCount = messages.length;
    const lastMessage = messagesCount && orderBy(messages, 'updatedAt', 'desc')[0]

    return (
      <ListItem
        topDivider={true}
        bottomDivider={true}
        containerStyle={[infoTaskStyles.container, {marginTop:22}]}
        titleStyle={infoTaskStyles.title}
        subtitleStyle={infoTaskStyles.subtitle}
        rightTitleStyle={infoTaskStyles.rightTitle}
        chevron={<Chevron />}
        title={translate("Message.chat")}
        subtitle={(lastMessage || null) && (lastMessage.text ? lastMessage.text : (lastMessage.imgKey ? translate("Photo.photo") :  (lastMessage.place ? translate("Message.location") : '')))}
        badge={(messagesCount || null) && {
          value: messagesCount,
        }}
        leftIcon={{ type: 'material', name: 'attach-file', iconStyle: infoTaskStyles.leftIcon }}
        onPress={this.onPress.bind(this)}
      />
    )
  }
}

export default compose(
  graphql(gql(listMessagesForTask), {
    options: props => {
      const { taskId } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: listMessagesForTaskVariables(taskId)
      })
    },
    props: props => ({
      messages: props.data.listMessagesForTask ? props.data.listMessagesForTask.items : [],
      messagesData: props.data
    }),
  }),
)(InfoTaskMessages);
