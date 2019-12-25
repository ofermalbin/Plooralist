import React from 'react';
import { View } from 'react-native';

import { ListItem } from 'react-native-elements';

import { ActionSheetProvider, ActionSheetOptions } from '@expo/react-native-action-sheet';

import { infoListStyles } from '../config/stylesheets';

import ListMembers from './ListMembers';

class Members extends React.Component {

  constructor(props) {
    super(props);
  }

  onAddMembersPress() {
    this.props.navigation.navigate('AddMembers', {members: this.props.members, panelId: this.props.member.memberPanelId});
  }

  render() {

    const { canEditMembers } = this.props;
    return (
      <ActionSheetProvider>
      <View>
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={[infoListStyles.container, {marginTop:22}]}
          titleStyle={infoListStyles.title}
          rightTitleStyle={infoListStyles.rightTitle}
          title='Members'
          leftIcon={{ name: 'group', iconStyle: infoListStyles.leftIcon }}
          rightTitle={canEditMembers ? 'Add' : null}
          onPress={canEditMembers ? this.onAddMembersPress.bind(this) : null}
        />
        <ListMembers {...this.props} />
      </View>
      </ActionSheetProvider>
    );
  }
}

export default Members;
