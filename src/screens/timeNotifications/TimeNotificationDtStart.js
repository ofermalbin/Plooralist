import React from 'react';
import PropTypes from 'prop-types';

import { Platform, View ,Text } from 'react-native';

import { ListItem, Button } from 'react-native-elements';

import { timeNotificationStyles } from './config/stylesheets';

import moment from 'moment/min/moment-with-locales.js';

import { Chevron } from '../../components';

import DateTimePicker from '@react-native-community/datetimepicker';

import translate, { getI18nConfig } from '../../translations';

class TimeNotificationDtStart extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Time Nonification",
        headerRight: () => <Button clear title={translate("Common.Button.add")} titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
        headerLeft: () => <Button clear title={translate("Common.Button.cancel")} titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      dtstart: props.dtstart || now,
      mode: (Platform.OS === 'ios') ? 'datetime' : 'date',
      show: false,
    }
  }

  onDtstartChange(event, value) {
    const { mode, show } = this.state;
    if (!value) {
      this.setState({
        mode: (Platform.OS === 'ios') ? 'datetime' : 'date',
        show: false
      });
      return;
    }
    const dtstart = moment(value).toDate();
    this.setState({dtstart: dtstart});
    if (Platform.OS === 'android') {
      if ((mode === 'date') && show ) {
        this.setState({
          mode: 'time'
        });
      }
      else {
        this.setState({
          mode: 'date',
          show: false
        });
      }
    }
    this.props.onDtstartChange(dtstart);
  }

  render() {

    const { languageTag, isRTL } = getI18nConfig();
    const { dtstart, mode, show } = this.state;
    return (
      <View>
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={timeNotificationStyles.container}
          titleStyle={timeNotificationStyles.title}
          subtitleStyle={timeNotificationStyles.subtitle}
          chevron={<Chevron />}
          title={translate("TimeNotification.start")}
          subtitle={moment(dtstart).locale(languageTag).format('LLLL')}
          onPress={() => this.setState({show: !this.state.show})}
        />
        {show && <DateTimePicker
          value={dtstart}
          mode={mode}
          is24Hour={true}
          display='default'
          locale={languageTag}
          onChange={this.onDtstartChange.bind(this)}
        />}
      </View>
    )
  }
}

export default TimeNotificationDtStart;
