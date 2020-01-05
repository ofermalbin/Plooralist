import React from 'react';

import { ScrollView, View, Text } from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { getPanel, getMember } from '../../graphql/queries';
import { onUpdatePanel, onDeletePanel } from '../../graphql/subscriptions';

import Loading from '../../components/Loading';

import { InfoSinglePanel } from './singlePanel';
import { InfoCouplePanel } from './couplePanel';
import { InfoTeamPanel } from './teamPanel';

class InfoPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { member, panel } = this.props;

    if (!member || !panel) {
      return (
        <Loading />
      );
    }

    let header;

    switch(panel.type) {
      case 1:
          header = <InfoSinglePanel {...this.props} />
        break;
      case 2:
          header = <InfoCouplePanel {...this.props} />
        break;
      case 3:
          header = <InfoTeamPanel {...this.props} />
        break;
      default:
        return null;
    }
    return (
      <ScrollView>
        <View>
          {header}
        </View>
      </ScrollView>
    );
  }
}

const enhance = compose(
  graphql(gql(getPanel), {
    options: props => {
      const { panelId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: panelId ? panelId : null
        }
      })
    },
    props: props => ({
      panel: props.data.getPanel ? props.data.getPanel : null,
      panelData: props.data
    })
  }),
  graphql(gql(getMember), {
    options: props => {
      const { memberId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: memberId ? memberId : null
        }
      })
    },
    props: props => ({
      member: props.data.getMember ? props.data.getMember : null,
      memberData: props.data
    })
  }),
)(InfoPanel);

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: () => <HeaderBackButton onPress={() => {navigation.goBack(null);}} />,
      headerTitle: "Info",
    };
}

export default enhance;
