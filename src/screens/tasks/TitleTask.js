import React from 'react';
import { View, Text } from 'react-native';

import compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { getTask } from '../../graphql/queries';

import { Loading } from '../../components';

import { titleTaskStyles } from './config/stylesheets';

class TitleTask extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { task } = this.props;

    if (!task) {
      return (
        <Loading />
      );
    }

    return (
        <Text style={titleTaskStyles.nameText}>{task.name}</Text>
    );
  }
};

export default compose(
  graphql(gql(getTask), {
    options: props => {
      const { taskId } = props;
      return ({
        fetchPolicy: 'cache-and-network',
        variables: {
          id: taskId ? taskId : null
        }
      })
    },
    props: props => ({
      task: props.data.getTask ? props.data.getTask : null,
      data: props.data
    })
  }),
)(TitleTask);
