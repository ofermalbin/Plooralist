import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import { ListItem, Icon } from 'react-native-elements';

import { AvatarS3Image } from '../../../components';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';
import { graphqlMutation } from 'aws-appsync-react';

import { getPanel, listMembersForPanel } from '../../../graphql/queries';
import { updatePanel } from '../../../graphql/mutations';
import { onCreateMember, onUpdateMember, onDeleteMember } from '../../../graphql/subscriptions';

import { infoAvatarStyles, infoListStyles, createByAtStyles } from '../config/stylesheets';

import { includes, find } from 'lodash';

import { isPanelOwner, canAccessPanel } from '../../panels';

import { TextNameUser } from '../../users';

import { PhotoEdit } from '../../photos';

import Members from '../members/Members';

import MutePanel from '../MutePanel';
import LeavePanel from '../LeavePanel';
import DeletePanel from '../DeletePanel';

import uuid from 'react-native-uuid';

import { storeFileInS3 } from '../../../lib/s3';

const __capitalize_Words = function(str) {
  return str && str.replace (/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

class InfoTeamPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
    }
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

  onEditNamePress() {
    const { panel } = this.props;
    this.props.navigation.navigate('EditPanelName', {panel: panel});
  };

  onEditAvatarPress() {
    const { panel } = this.props;

    PhotoEdit({
      photo: panel.imgKey || this.state.source,
      removePhoto: () => {
        this.setState({source: null});
        const input = {
          id: panel.id,
          expectedVersion: panel.version,
          imgKey: null
        };
        const offline = Object.assign(panel, {offline: true, imgKey: null, updatedAt: (new Date()).toISOString()});
        this.props.updatePanel({...offline, input});
      },
      updatePhoto: async (photo) => {
        this.setState({source: photo});
        const awsKey = `${uuid.v1()}.jpeg`;
        const result = await storeFileInS3(photo, awsKey, "public");
        const input = {
          id: panel.id,
          expectedVersion: panel.version,
          imgKey: result.key
        };
        const offline = Object.assign(panel, {offline: true, updatedAt: (new Date()).toISOString()});
        this.props.updatePanel({...offline, input});
      }
    });
  }

  render() {

    const { panel, member } = this.props;

    const isOwner = isPanelOwner(member);
    const canAccess = canAccessPanel(member);

    return (
      <ScrollView>
      <View>
        <AvatarS3Image
          source={this.state.source}
          imgKey={panel.imgKey}
          level='public'
          name={panel.name}
          containerStyle={infoAvatarStyles.container}
          titleStyle={infoAvatarStyles.title}
          rounded={false} showEditButton={true}
          showEditButton={isOwner}
          editButton={{ size: 24, onPress: this.onEditAvatarPress.bind(this) }}
        />
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={infoListStyles.container}
          titleStyle={infoListStyles.title}
          chevron={isOwner}
          title={__capitalize_Words(panel.name)}
          leftAvatar={
            <AvatarS3Image
              source={this.state.source}
              imgKey={panel.imgKey}
              level='public'
              name={panel.name}
              containerStyle={infoListStyles.avatarContainer}
              rounded={true} showEditButton={true}
              showEditButton={isOwner}
              editButton={{ onPress: this.onEditAvatarPress.bind(this) }}
            />
          }
          onPress={this.onEditNamePress.bind(this)}
          disabled={panel.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
        <Members {...this.props} isOwner={isOwner} canAccess={canAccess} />
        <MutePanel {...this.props} />
        <LeavePanel {...this.props} />
        {isOwner && <DeletePanel {...this.props} />}
        <View style={createByAtStyles.container}>
          <Text style={createByAtStyles.text}>{`${'created at '}${moment(panel.createdAt).locale('en').format('LL')}.`}</Text>
        </View>
      </View>
      </ScrollView>
    )
  }
};

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
  graphqlMutation(gql(updatePanel), gql(getPanel), 'Panel')
) (InfoTeamPanel);
