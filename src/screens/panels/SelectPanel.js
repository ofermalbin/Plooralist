import React from 'react';
import { ScrollView, View, Text} from 'react-native';

import { ListItem, Avatar } from "react-native-elements";

import { find, indexOf } from 'lodash';

import { actionListStyles } from './config/stylesheets';

import { SinglesPanels, CouplesPanels } from '../panels';

import ContactsAreNotUsers from '../contactsAreNotUsers';

import translations from '../../translations';

class SelectPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onTeamPress() {
    this.props.navigation.navigate('CreateMembers');
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
              icon={{name: "add", size: actionListStyles.leftIconAvatarIcon.borderRadius, color: actionListStyles.leftIconAvatarIcon.color}}
              placeholderStyle={actionListStyles.leftIconAvatarPlaceholder}
            />
          }
          title={translations("Panel.new team")}
          onPress={this.onTeamPress.bind(this)}
        />
        <SinglesPanels navigation={this.props.navigation} />
        <CouplesPanels navigation={this.props.navigation} />
        <ContactsAreNotUsers navigation={this.props.navigation} />
      </View>
      </ScrollView>
    );
  }
}

export default SelectPanel;
