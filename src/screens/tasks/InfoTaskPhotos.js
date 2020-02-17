import React from 'react';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription } from 'aws-appsync';

import { listMessagesForTask } from '../../graphql/queries';

import { onCreateTaskMessage, onUpdateTaskMessage, onDeleteTaskMessage } from '../../graphql/subscriptions';

import { orderBy, filter } from 'lodash';

import { ListItem } from 'react-native-elements';

import { infoTaskStyles } from './config/stylesheets';

import { S3Image, Chevron } from '../../components';

import { listMessagesForTaskVariables } from './util';

import translate from '../../translations';

class InfoTaskPhotos extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lastPhoto: null,
      photosCount: null,
    };
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

    this.props.messages && this.props.messages.length && this.getLastPhoto(this.props.messages);
  }

  componentWillReceiveProps(nextProps) {
    const { messages } = nextProps;
    if (messages && messages.length && (!this.props.messages || !this.props.messages.length || messages.length != this.props.messages.length)) {
      this.props.messages && this.getLastPhoto(nextProps.messages);
    }
  }

  onPress() {
    const { taskId } = this.props;
    this.props.navigation.navigate('TaskPhotos', {taskId: taskId});
  }

  getLastPhoto(messages) {
    const photos = filter(messages, message => message.imgKey);
    const photosCount = photos.length;
    const lastPhoto = photosCount && orderBy(photos, 'updatedAt', 'desc')[0];

    this.setState({lastPhoto, photosCount});
  }

  render() {
    const { isOwner, messages } = this.props;

    const photos = filter(messages, message => message.imgKey);
    const photosCount = photos.length;
    const lastPhoto = photosCount && orderBy(photos, 'updatedAt', 'desc')[0]

    if (!photosCount && !isOwner) {
      return null;
    }

    return (
      <ListItem
        topDivider={true}
        bottomDivider={true}
        containerStyle={[infoTaskStyles.container, {marginTop:22}]}
        titleStyle={infoTaskStyles.title}
        subtitleStyle={infoTaskStyles.subtitle}
        rightTitleStyle={infoTaskStyles.rightTitle}
        chevron={<Chevron />}
        leftAvatar={(lastPhoto || null) &&
          <S3Image
            imgKey={lastPhoto.imgKey}
            level='public'
            width={100}
            height={100}
            //borderRadius={13}
            margin={3}
            resizeMode='cover'
          />
        }
        title={translate("Photo.photos")}
        badge={(photosCount || null) && {
          value: photosCount,
        }}
        rightTitle={(!photosCount || null) && translate("Common.Button.add")}
        leftIcon={(!photosCount || null) && { type: 'material', name: 'photo', iconStyle: infoTaskStyles.leftIcon }}
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
)(InfoTaskPhotos);
