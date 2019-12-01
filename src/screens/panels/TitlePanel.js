import React from 'react';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { getPanel, getMember } from '../../graphql/queries';

import Loading from '../../components/Loading';

import { TitleSinglePanel } from './singlePanel';
import { TitleCouplePanel } from './couplePanel';
import { TitleTeamPanel } from './teamPanel';

class TitlePanel extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    const { member, panel } = this.props;
    this.props.navigation.navigate('InfoPanel', {panelId: panel.id, memberId: member.id});
  }

  render() {

    const { member, panel } = this.props;

    if (!member || !panel) {
      return (
        <Loading />
      );
    }

    let title;

    switch(panel.type) {
      case 1:
        title = <TitleSinglePanel {...this.props} onPress={this.onPress.bind(this)} />;
        break;
      case 2:
        title = <TitleCouplePanel {...this.props} onPress={this.onPress.bind(this)} />;
        break;
      case 3:
        title = <TitleTeamPanel {...this.props} onPress={this.onPress.bind(this)} />;
        break;
      default:
        return null;
    }
    return (
      title
    );
  }
};

export default compose(
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
      const { memberId } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: memberId
        }
      })
    },
    props: props => ({
      member: props.data.getMember ? props.data.getMember : null,
      memberData: props.data
    })
  }),
)(TitlePanel);
