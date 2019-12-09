import React from 'react';

import { View, Alert } from 'react-native';

import compose from 'lodash.flowright';
import gql from 'graphql-tag';

import { graphqlMutation } from 'aws-appsync-react';

import { addTaskMuteMember, removeTaskMuteMember } from '../../graphql/mutations';
import { listTasksForPanel } from '../../graphql/queries';

import { ListItem } from 'react-native-elements';

import { includes } from 'lodash';

import { withCurrentUser } from '../../contexts';

import { listTasksForPanelVariables } from './util';

import { infoListStyles } from './config/stylesheets';

class MuteTask extends React.Component {

  constructor(props) {
    super(props);

    const { task, currentUser } = props;
    const isMute = includes(task.membersAreMute, currentUser.id);

    this.state = {
      isMute: isMute,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { task, currentUser } = nextProps;
    const isMute = includes(task.membersAreMute, currentUser.id);
    this.setState({
      isMute: isMute,
    })
  }

  onMutePress() {
    const { task } = this.props;
    const isMute = this.state.isMute;
    Alert.alert(
      isMute ? 'Unmute' : 'Mute',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => {
          /*
          !isMute ?
            this.props.addTaskMuteMember(Object.assign(task, {updatedAt: (new Date()).toISOString()}))
          :
            this.props.removeTaskMuteMember(Object.assign(task, {updatedAt: (new Date()).toISOString()}));
          */
          this.setState({
            isMute: !isMute,
          })
        }},
      ]
    )
  }

  render() {
    return (
      <ListItem
        containerStyle={[infoListStyles.container, { marginTop: 22 }]}
        titleStyle={infoListStyles.title}
        rightTitleStyle={infoListStyles.rightTitle}
        topDivider={true}
        bottomDivider={true}
        chevron={true}
        title={this.state.isMute ? 'Unmute' : 'Mute'}
        leftIcon={{name: this.state.isMute ? 'volume-off' : 'volume-up', iconStyle: infoListStyles.leftIcon}}
        rightTitle={this.state.isMute ? 'On' : 'Off'}
        onPress={this.onMutePress.bind(this)}
      />
    )
  }
}

/*export default compose(
  //graphqlMutation(gql(addTaskMuteMember), variables => ({ query: listTasksForPanel, variables: {panelId: variables.panelId }}), 'Task'),
  //graphqlMutation(gql(removeTaskMuteMember), variables => ({ query: listTasksForPanel, variables: {panelId: variables.panelId }}), 'Task')
)(withCurrentUser(MuteTask));*/

export default withCurrentUser(MuteTask);
