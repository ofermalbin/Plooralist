import React from 'react';
import { View } from 'react-native';

import { ListItem } from 'react-native-elements';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembersForPanel } from '../../../graphql/queries';
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
        {query: gql(listMembersForPanel), variables: {memberPanelId: memberPanelId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: {memberPanelId: memberPanelId}}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: {memberPanelId: memberPanelId}}
      )
    );
  }

  onAddMembersPress() {
    this.props.navigation.navigate('AddMembers', {members: this.props.members, panelId: this.props.member.memberPanelId});
  }

  render() {

    const { isOwner, canAccess } = this.props;
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
          rightTitle={canAccess ? 'Add' : null}
          onPress={canAccess ? this.onAddMembersPress.bind(this) : null}
        />
        <ListMembers {...this.props} />
      </View>
    );
  }
}

export default compose(
  graphql(gql(listMembersForPanel), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        memberPanelId: props.member.memberPanelId
      }
    }),
    props: props => ({
      members: props.data.listMembersForPanel ? props.data.listMembersForPanel.items : [],
      data: props.data
    }),
  }),
) (Members);
