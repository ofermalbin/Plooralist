import React from 'react';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { listMembersForPanel } from '../../../graphql/queries';
import { onCreateMember, onUpdateMember, onDeleteMember } from '../../../graphql/subscriptions';

import { withContacts } from '../../../contexts';

import { find } from 'lodash';

import { getUserName } from '../../../util';

import _RowPanel from '../_RowPanel';

import { listMembersForPanelVariables } from '../util';

class RowCouplePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { memberPanelId } = this.props.member;
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
    this.props.data.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
  }

  render() {
    const { member, members, contacts } = this.props;
    const couple = find(members, couple => couple.memberUserId != member.memberUserId);

    if (!member || !couple || !couple.user) {
      return null;
    }

    return (
      <_RowPanel {...this.props} name={getUserName(couple.user, contacts)} imgKey={couple.user.imgKey} level='protected' identityId={couple.user.identityId} />
    )
  }
};

export default compose(
  graphql(gql(listMembersForPanel), {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: listMembersForPanelVariables(props.member.memberPanelId)
    }),
    props: props => ({
      members: props.data.listMembersForPanel ? props.data.listMembersForPanel.items : [],
      data: props.data
    }),
  }),
) (withContacts(RowCouplePanel));
