import React from 'react';
import PropTypes from 'prop-types';

import { View ,Text } from 'react-native';

import { ListItem, Button } from 'react-native-elements';

import { timeNotificationStyles } from './config/stylesheets';

import moment from 'moment/min/moment-with-locales.js';

import DatePicker from 'react-native-datepicker';

class TimeNotificationDtStart extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Time Nonification",
        headerRight: <Button clear title="Add" titleStyle={{color: '#5fb8f6'}} disabled={params.disabled} onPress={() => params.onAddPress()} />,
        headerLeft: <Button clear title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      dtstart: props.dtstart || now,
    }
  }

  onDtstartChange(value) {
    const dtstart = moment(value).toDate();
    this.setState({dtstart: dtstart});
    this.props.onDtstartChange(dtstart);
  }

  render() {

    const locale = 'en';
    return (
      <View>
        <ListItem
          topDivider={true}
          bottomDivider={true}
          containerStyle={timeNotificationStyles.container}
          titleStyle={timeNotificationStyles.title}
          subtitleStyle={timeNotificationStyles.subtitle}
          chevron={true}
          title='Start'
          subtitle={moment(this.state.dtstart).locale(locale).format('LLLL')}
          onPress={() => this._DatePicker.onPressDate()}
        />
        <DatePicker
          ref={component => this._DatePicker = component}
          style={{height: 0, width: 0}}
          date={this.state.dtstart}
          mode="datetime"
          hideText={true}
          locale={locale}
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          customStyles={{
            btnTextText: {
              color: 'blue'
            },
            btnTextConfirm: {
              color: 'blue'
            },
            btnTextCancel: {
              color: 'red'
            },
          }}
          onDateChange={this.onDtstartChange.bind(this)}
        />
      </View>
    )
  }
}

export default TimeNotificationDtStart;
