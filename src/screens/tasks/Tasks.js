import React from 'react';

import { HeaderBackButton } from 'react-navigation-stack';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { buildSubscription } from 'aws-appsync';

import { getMember, listTasksForPanel } from '../../graphql/queries';
import { onCreateTask, onUpdateTask, onDeleteTask } from '../../graphql/subscriptions';

import Loading from '../../components/Loading';

import { TitlePanel } from '../panels';
import ListTasks from './ListTasks';

import { isMemberBlock } from '../panels';

import { listTasksForPanelVariables } from './util';

class Tasks extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { panelId } = this.props.navigation.state.params;
    this.props.tasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onCreateTask), variables: {taskPanelId: panelId}},
        {query: gql(listTasksForPanel), variables: listTasksForPanelVariables(panelId)}
      )
    );
    this.props.tasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onUpdateTask), variables: {taskPanelId: panelId}},
        {query: gql(listTasksForPanel), variables: listTasksForPanelVariables(panelId)}
      )
    );
    this.props.tasksData.subscribeToMore(
      buildSubscription(
        {query: gql(onDeleteTask), variables: {taskPanelId: panelId}},
        {query: gql(listTasksForPanel), variables: listTasksForPanelVariables(panelId)}
      )
    );
  }

  render() {

    const { panelId, memberId } = this.props.navigation.state.params;

    const { member } = this.props;

    if (!member || isMemberBlock(member)) {
      return <Loading />;
    }
    return (
      <ListTasks {...this.props} />
    );
  }
}

const enhance = compose(
  graphql(gql(getMember), {
    options: props => {
      const { memberId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: memberId
        }
      })
    },
    props: props => ({
      member: props.data.getMember ? props.data.getMember : null,
    })
  }),
  graphql(gql(listTasksForPanel), {
    options: props => {
      const { panelId } = props.navigation.state.params;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: listTasksForPanelVariables(panelId)
      })
    },
    props: props => ({
      tasks: props.data.listTasksForPanel ? props.data.listTasksForPanel.items : [],
      tasksData: props.data
    }),
  }),
) (Tasks);

enhance.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => <TitlePanel {...params} navigation={navigation} />,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    };
}

export default enhance;
