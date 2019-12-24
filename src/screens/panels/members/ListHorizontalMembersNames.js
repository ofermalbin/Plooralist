import React from 'react';

import { View, Text, FlatList } from 'react-native';

import { Button, Divider, normalize, colors } from "react-native-elements";

import { titlePanelStyles } from '../config/stylesheets';

import TextMemberName from './TextMemberName';

class ListHorizontalMembersNames extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { members } = this.props;

    return (
      <FlatList
        data={members}
        renderItem={({ item }) => <View style={{flexDirection: 'row'}}><TextMemberName member={item} style={titlePanelStyles.memberNameText} /><Text style={titlePanelStyles.memberCommaText}>,</Text></View>}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    );
  }
}

export default ListHorizontalMembersNames;
