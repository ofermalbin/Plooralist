import React from 'react';
import { View, ScrollView } from 'react-native';

import { ListItem, Button, Input } from 'react-native-elements';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { updateUser } from '../../graphql/mutations';
import { getUser, listUsers } from '../../graphql/queries';

import { inputStyles } from './config/stylesheets';

const Locales = [
  {value: 'en', label: 'English'},
  {value: 'he', label: 'Hebrew'},
];

class UpdateCurrentUserLocale extends React.Component {

  constructor(props) {
    super(props);

    const { currentUser } = props.navigation.state.params;
    this.state = {
      locale: currentUser.locale,
    }
    props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
  }

  onSavePress() {
    const { currentUser } = this.props.navigation.state.params;
    const locale = this.state.locale;
    const input = {
      id: currentUser.id,
      expectedVersion: currentUser.version,
      locale
    };
    const offline = Object.assign(currentUser, {offline: true, locale, updatedAt: (new Date()).toISOString()});
    this.props.updateUser({...offline, input});
    this.props.navigation.goBack();
  }

  onLocaleChange(locale) {
    this.props.navigation.setParams({onSavePress: this.onSavePress.bind(this)});
    this.setState({locale});
  }

  render() {
    return (
      <View style={{ marginTop: 22, backgroundColor: '#FFFFFF', flex:1 }}>
      <ScrollView>
        {Locales.map((locale, i) => (
        <ListItem
          topDivider={true}
          key={i}
          bottomDivider={true}
          chevron={false}
          title={locale.label}
          checkmark={locale.value === this.state.locale}
          onPress={this.onLocaleChange.bind(this, locale.value)}
        />))}
      </ScrollView>
      </View>
    )
  }
}

const enhance = compose(
  graphqlMutation(gql(updateUser), gql(listUsers), 'User')
  //graphqlMutation(gql(updateUser), variables => ({query: gql(listUsers), variables: {filter: {id: {eq: variables.id}}}}), 'User')
) (UpdateCurrentUserLocale)


enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: "Locale",
      headerRight: <Button type="clear" title="Update" titleStyle={{color: '#5fb8f6'}} onPress={() => params.onSavePress()} />,
      headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
