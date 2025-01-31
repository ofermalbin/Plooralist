import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, FlatList, Alert } from 'react-native';

import { ListItem, Button, Divider, Input, colors } from 'react-native-elements';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { listMembersForUser } from '../../../graphql/queries';
import { createPanelAndMembers } from '../../../graphql/mutations';

import uuid from 'react-native-uuid';

import { withCurrentUser } from '../../../contexts';

import { RowViewPotentialUser } from '../members';

import { AvatarS3Image } from '../../../components';
import { Loading } from '../../../components';

import { PhotoEdit } from '../../photos';

import { listMembersForUserVariables } from '../util';

import { infoAvatarStyles, inputStyles, infoListStyles } from '../config/stylesheets';

import { storeFileInS3 } from '../../../lib/s3';

import translate from '../../../translations';

class CreateTeamPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      source: null,
      upload: null,
    }
  }

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
      id: uuid.v4(),
      type: 3,
      onlyManagersCreateTask: false,
      onlyManagersEditInfo: true,
      onlyManagersEditMembers: true,
      name: name,
      imgKey: null,
      ownerId: currentUser.id,
      membersIds: users.map(user => user.id),
    };

    const now = new Date();

    const offline = {
      offline: true,
      version: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      memberPanelId: null,
      memberUserId: currentUser.id,
      coupleUserId: null,
      user: currentUser,
      owner: true,
      manager: true,
      block: false,
      mute: false,
      pin: false,
      panel: {
        __typename: 'Panel',
        id: null,
        offline: true,
        version: null,
        type: 3,
        onlyManagersCreateTask: false,
        onlyManagersEditInfo: true,
        onlyManagersEditMembers: true,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        name: name,
        imgKey: null
      }
    };

    if(this.state.source) {
      const awsKey = `${uuid.v1()}.jpeg`;
      this.setState({upload: true});
      const result = await storeFileInS3(this.state.source, awsKey, "public");
      this.props.createPanelAndMembers({
          ...Object.assign({}, offline, {'panel.imgKey': result.key}),
          ...Object.assign({}, input, {imgKey: result.key})
      });
      this.setState({upload: false});
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
          showEditButton={true}
          editButton={{ size: 24 }}
          onEditPress={this.onEditAvatarPress.bind(this)}
        />
      }
      <ListItem
        title={
          <Input
            inputStyle={inputStyles.input}
            value={this.state.name}
            autoFocus={true}
            placeholder={translate("Panel.team name")}
            onChangeText={this.onNameChangeText.bind(this)}
          />
        }
        leftAvatar={
          <AvatarS3Image
            source={this.state.source}
            name={this.state.name}
            rounded={true}
            size='medium'
            rounded={true}
            onEditPress={this.onEditAvatarPress.bind(this)}
            showEditButton={true}
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
  graphqlMutation(gql(createPanelAndMembers), variables => ({query: gql(listMembersForUser), variables: listMembersForUserVariables(variables.memberUserId)}), 'Member'),
) (withCurrentUser(CreateTeamPanel));

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: translate("Panel.new team"),
      headerRight: () => <Button type="clear" title={translate("Common.Button.create")} titleStyle={{color: '#5fb8f6'}} disabled={!params.name} onPress={() => params.onCreatePress()} />,
      headerLeft: () => <Button type="clear" title={translate("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
