import React from 'react';
import { View } from 'react-native';

import { ListItem } from 'react-native-elements';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembers } from '../../../graphql/queries';
import { onCreateMember, onUpdateMember, onDeleteMember } from '../../../graphql/subscriptions';

import { infoListStyles } from '../config/stylesheets';

import ListMembers from './ListMembers';

class Members extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { memberPanelId } = this.props.member;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembers), variables: {filter: {memberPanelId: {eq: memberPanelId}}}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembers), variables: {filter: {memberPanelId: {eq: memberPanelId}}}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembers), variables: {filter: {memberPanelId: {eq: memberPanelId}}}}
      )
    );
  }

  onAddMembersPress() {
    this.props.navigation.navigate('AddMembers', {members: this.props.members, panelId: this.props.member.memberPanelId});
  }

  render() {

    const { isOwner } = this.props;
    return (
      <View>
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={[infoListStyles.container, {marginTop:22}]}
          titleStyle={infoListStyles.title}
          rightTitleStyle={infoListStyles.rightTitle}
          title='Members'
          leftIcon={{ name: 'group', iconStyle: infoListStyles.leftIcon }}
          rightTitle={isOwner ? 'Add' : null}
          onPress={isOwner ? this.onAddMembersPress.bind(this) : null}
        />
        <ListMembers {...this.props} />
      </View>
    );
  }
}

export default compose(
  graphql(gql(listMembers), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        filter: {memberPanelId: {eq: props.member.memberPanelId}}
      }
    }),
    props: props => ({
      members: props.data.listMembers ? props.data.listMembers.items : [],
      data: props.data
    }),
  }),
) (Members);
