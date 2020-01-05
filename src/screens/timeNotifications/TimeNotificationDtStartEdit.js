import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'react-native-elements';

import _TimeNotificationEdit from './_TimeNotificationEdit';

import t from 'tcomb-form-native';

const TimeNotificationForm = t.struct({
  dtstart: t.Date,
});

class TimeNotificationDtStartEdit extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
          headerRight: () => <Button clear title="Save" titleStyle={{color: 'blue'}} onPress={() => params.onSavePress()} />
      };
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { timeNotification_id } = this.props.navigation.state.params;
    return (
      <_TimeNotificationEdit params={{timeNotification_id: timeNotification_id}} TimeNotificationForm={TimeNotificationForm} navigation={this.props.navigation} />
    )
  }
}

export default TimeNotificationDtStartEdit;
