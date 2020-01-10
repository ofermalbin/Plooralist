import React from 'react';
import { ScrollView, View } from 'react-native';
import { ListItem, Avatar, Divider } from 'react-native-elements';

import { actionListStyles } from './config/stylesheets';

import { CouplesPanels } from '../panels';

import translations from '../../translations';

class Contacts extends React.Component {

  constructor(props) {
    super(props);
  }

  onInviteFriendsPress() {
    this.props.navigation.navigate('InviteFriends');
  }

  render() {
    return (
      <ScrollView>
        <View>
          <ListItem
            bottomDivider={true}
            containerStyle={actionListStyles.container}
            titleStyle={actionListStyles.title}
            leftIcon={
              <Avatar
                containerStyle={actionListStyles.leftIconAvatarContainer}
                rounded={true}
                icon={{name: "person-add", size: actionListStyles.leftIconAvatarIcon.borderRadius, color: actionListStyles.leftIconAvatarIcon.color}}
                placeholderStyle={actionListStyles.leftIconAvatarPlaceholder}
              />
            }
            title={translations("InviteFriend.invite friends")}
            onPress={this.onInviteFriendsPress.bind(this)}
          />
          <CouplesPanels navigation={this.props.navigation} />
        </View>
      </ScrollView>
    );
  }
}

export default Contacts;
