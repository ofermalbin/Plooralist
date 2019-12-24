import React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import { ListItem, Icon } from 'react-native-elements';

import { AvatarS3Image } from '../../../components';
import FastImage from 'react-native-fast-image';
import aws_exports from '../../../aws-exports';

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

import { isMemberManager } from '../../panels';

import { TextNameUser } from '../../users';

import { PhotoEdit } from '../../photos';

import Members from '../members/Members';

import MutePanel from '../MutePanel';
import LeavePanel from '../LeavePanel';
import DeletePanel from '../DeletePanel';

import uuid from 'react-native-uuid';

import { storeFileInS3 } from '../../../lib/s3';

import { listMembersForPanelVariables, isOnlyManagersEditInfo } from '../util';

const __capitalize_Words = function(str) {
  return str && str.replace (/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

class InfoTeamPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      source: null,
      onlyManagersCreateTask: null,
      onlyManagersEditInfo: null,
    }
  }

  componentDidMount() {
    const { memberPanelId } = this.props.member;
    this.props.membersData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
    this.props.membersData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
      )
    );
    this.props.membersData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteMember), variables: {memberPanelId: memberPanelId}},
        {query: gql(listMembersForPanel), variables: listMembersForPanelVariables(memberPanelId)}
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
        const uri = `https://${aws_exports.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${result.key}`;
        FastImage.preload([{uri}])
        setTimeout(() => {
          const input = {
            id: panel.id,
            expectedVersion: panel.version,
            imgKey: result.key
          };
          const offline = Object.assign(panel, {offline: true, updatedAt: (new Date()).toISOString()});
          this.props.updatePanel({...offline, input});
        }, 1000);
      }
    });
  }

  onPermissionPress() {
    const { panel } = this.props;
    this.props.navigation.navigate('EditPanelPermission', {panel: panel});
  };

  render() {

    const { panel, member } = this.props;

    const isManager = isMemberManager(member);

    const canEditInfo = !isOnlyManagersEditInfo(panel) || isManager

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
          rounded={false}
          showEditButton={canEditInfo}
          editButton={{ size: 24 }}
          onEditPress={this.onEditAvatarPress.bind(this)}
        />
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={infoListStyles.container}
          titleStyle={infoListStyles.title}
          chevron={canEditInfo}
          title={__capitalize_Words(panel.name)}
          leftAvatar={
            <AvatarS3Image
              source={this.state.source}
              imgKey={panel.imgKey}
              level='public'
              name={panel.name}
              size='medium'
              rounded={true} showEditButton={true}
              showEditButton={canEditInfo}
              passedEditButton={{ onPress: this.onEditAvatarPress.bind(this) }}
            />
          }
          onPress={canEditInfo ? this.onEditNamePress.bind(this) : null}
          disabled={panel.offline}
          disabledStyle={{backgroundColor: '#F0F8FF'}}
        />
        {isManager && <ListItem
          containerStyle={[infoListStyles.container, { marginTop: 22 }]}
          titleStyle={infoListStyles.title}
          topDivider={true}
          bottomDivider={true}
          chevron={true}
          title='Permission'
          leftIcon={{name: 'create', iconStyle: infoListStyles.leftIcon}}
          onPress={this.onPermissionPress.bind(this)}
        />}
        <Members {...this.props} isManager={isManager} />
        <MutePanel {...this.props} />
        <LeavePanel {...this.props} />
        {isManager && <DeletePanel {...this.props} />}
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
      variables: listMembersForPanelVariables(props.member.memberPanelId)
    }),
    props: props => ({
      members: props.data.listMembersForPanel ? props.data.listMembersForPanel.items : [],
      membersData: props.data
    }),
  }),
  graphqlMutation(gql(updatePanel), gql(getPanel), 'Panel')
) (InfoTeamPanel);
