import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, FlatList, Alert } from 'react-native';

import { ListItem, Button, Divider, Input, colors } from 'react-native-elements';

import uuid from 'react-native-uuid';
import { each } from 'lodash';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listMembersForUser } from '../../../graphql/queries';
import { createPanelAndMembers } from '../../../graphql/mutations';

import { withCurrentUser } from '../../../contexts';

import { RowViewPotentialUser } from '../members';

import { AvatarS3Image } from '../../../components';
import Loading from '../../../components/Loading';

import { PhotoEdit } from '../../photos';

import { infoAvatarStyles, inputStyles, infoListStyles } from '../config/stylesheets';

import { storeFileInS3 } from '../../../lib/s3';

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  pictureEditText: {
    color: '#037aff',
  },
});

class CreateTeamPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      source: null,
      upload: null,
    }
  }

  onAvatarPress() {
    this.state.source ? this.props.navigation.navigate('PhotoMax', {photo: this.state.source}) : this.onEditAvatarPress.bind(this)();
  };

  onEditAvatarPress() {
    PhotoEdit({
      photo: this.state.source,
      removePhoto: () => this.setState({source: null}),
      updatePhoto: (photo) => this.setState({source: photo}),
    });
  };

  async onCreatePress() {
    const { currentUser } = this.props;
    const { users } = this.props.navigation.state.params;

    const name = this.state.name;
    const input = {
      type: 3,
      name: name,
      imgKey: null,
      ownersIds: [currentUser.id],
      canAccessIds: users.map(user => user.id),
      membersIds: []
    };

    const now = new Date();
    let membersItems = [];
    each(users, user => membersItems.push(
      {
        __typename: 'Member',
        id: null,
        offline: true,
        version: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        memberPanelId: null,
        memberUserId: user.id,
        user: user,
        panel: {
          __typename: 'Panel',
          id: null,
          offline: true,
          version: null,
          type: 3,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          name: name,
          imgKey: null,
          members: {
            __typename: 'Members',
            nextToken: null
          }
        },
        isOwner: true,
        canAccess: true,
        block: false,
        mute: false,
        pin: false,
      })
    );

    const offline = {
      offline: true,
      version: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      memberPanelId: null,
      memberUserId: currentUser.id,
      user: currentUser,
      isOwner: true,
      canAccess: true,
      block: false,
      mute: false,
      pin: false,
      panel: {
        __typename: 'Panel',
        id: null,
        offline: true,
        version: null,
        type: 3,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        name: name,
        imgKey: null,
        members: {
          __typename: 'Members',
          items: membersItems,
          nextToken: null
        }
      }
    };

    if(this.state.source) {
      alert('source');
      this.setState({upload: true});
      const awsKey = `${uuid.v1()}.jpeg`;
      const { access, key } = await storeFileInS3(this.state.source, awsKey, "public");
      this.props.createPanelAndMembers({
          ...Object.assign({}, offline, {'panel.imgKey': key}),
          ...Object.assign({}, input, {imgKey: key})
      });
      this.props.navigation.navigate('Panels');
    }
    else {
      this.props.createPanelAndMembers({...offline, ...input});
      this.props.navigation.navigate('Panels');
    }
  }

  onNameChangeText(name) {
    this.props.navigation.setParams({name: name.length ? true : false, onCreatePress: this.onCreatePress.bind(this)});
    this.setState({name: name});
  }

  render() {
    const { users } = this.props.navigation.state.params;

    if(this.state.upload) {
      return <Loading />
    }

    return (
      <View>
      {(this.state.name || this.state.source || null) &&
        <AvatarS3Image
          containerStyle={infoAvatarStyles.container}
          titleStyle={infoAvatarStyles.title}
          source={this.state.source}
          name={this.state.name}
          rounded={false}
          editButton={{ size: 24, onPress: this.onEditAvatarPress.bind(this) }}
          showEditButton={true}
        />
      }
      <ListItem
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.name}
            autoFocus={true}
            placeholder="Team Name"
            onChangeText={this.onNameChangeText.bind(this)}
          />
        }
        leftAvatar={
          <AvatarS3Image
            containerStyle={infoListStyles.avatarContainer}
            source={this.state.source}
            name={this.state.name}
            rounded={true}
            showEditButton={true}
            onEditButtonPress={this.onEditAvatarPress.bind(this)}
          />
        }
      />
      <View style={{ marginTop: 22 }}>
        <FlatList
          data={users}
          renderItem={({ item }) => <RowViewPotentialUser {...item} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(createPanelAndMembers), variables => ({query: gql(listMembersForUser), variables: {memberUserId: variables.memberUserId }}), 'Member'),
) (withCurrentUser(CreateTeamPanel));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "New Team",
      headerRight: <Button type="clear" title="Create" titleStyle={{color: '#5fb8f6'}} disabled={!params.name} onPress={() => params.onCreatePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;

/*<ListItem
    containerStyle={{ marginTop: -85, backgroundColor: 'transparent'}}
    title=' '
    rightIcon={{
      size: 20,
      name: 'photo-camera',
      reverse: true,
      color: colors.grey4,
      onPress: this.onEditAvatarPress.bind(this)
    }}
/>*/
