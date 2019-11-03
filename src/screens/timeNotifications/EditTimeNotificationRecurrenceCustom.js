import React from 'react';

import { View, StyleSheet, ScrollView } from 'react-native';
import { Button , ButtonGroup } from 'react-native-elements';

import moment from 'moment/min/moment-with-locales.js';

import { defaultOptions } from '../../lib/tcombForm';

import t from 'tcomb-form-native';

const buttons = ['Never', 'Until', 'Count'];

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'white',
  },
});

import TcombMultiSelect from './TcombMultiSelect';

const Freqs = t.enums({
  4: 'HOURLY',
  3: 'DAILY',
  2: 'WEEKLY',
  1: 'MONTHLY',
  0: 'YEARLY',
});

const Weekdays = t.enums({
  6 : 'SU',
  0 : 'MO',
  1 : 'TU',
  2 : 'WE',
  3 : 'TH',
  4 : 'FR',
  5 : 'SA',
});

const Months = t.enums({
  1 : 'Jan',
  2 : 'Feb',
  3 : 'Mar',
  4 : 'Apr',
  5 : 'May',
  6 : 'Jun',
  7 : 'Jul',
  8 : 'Aug',
  9 : 'Sep',
  10 : 'Okt',
  11 : 'Nov',
  12 : 'Dec',
});

var Positive = t.refinement(t.Number, function (n) {
  return n > 0;
});

const RecurrenceCustomBasicForm = {
  freq: Freqs,
  interval: Positive,
  byweekday: t.maybe(t.list(t.Number)),
  bymonth: t.maybe(t.list(t.Number)),
};

var listTransformer = {
  format: value => (value ? String(value) : ''),
  parse: value => (value ? Number(value) : null),
};

let options = Object.assign({}, defaultOptions, {
  fields: {
    freq: {
      nullOption: false,
      transformer: {
        format: value => (value ? String(value) : '3'),
        parse: value => (value ? Number(value) : 3),
      },
    },
    /*interval: {
      transformer: {
        format: value => (value ? String(value) : '1'),
        parse: value => (value ? Number(value) : 1),
      },
    },*/
    byweekday: {
      label: 'Week Days',
      factory: TcombMultiSelect,
      options: [
        { value: 6, text: 'SU' },
        { value: 0, text: 'MO' },
        { value: 1, text: 'TU' },
        { value: 2, text: 'WE' },
        { value: 3, text: 'TH' },
        { value: 4, text: 'FR' },
        { value: 5, text: 'SA' },
      ],
    },
    bymonth: {
      label: 'Months',
      factory: TcombMultiSelect,
      options: [
        { value: 1, text: 'Jan' },
        { value: 2, text: 'Feb' },
        { value: 3, text: 'Mar' },
        { value: 4, text: 'Apr' },
        { value: 5, text: 'May' },
        { value: 6, text: 'Jun' },
        { value: 7, text: 'Jul' },
        { value: 8, text: 'Aug' },
        { value: 9, text: 'Sep' },
        { value: 10, text: 'Oct' },
        { value: 11, text: 'Nov' },
        { value: 12, text: 'Dec' },
      ],
    },
    until: {
      mode: 'date',
      auto: 'none',
    },
  }
});

const RecurrenceCustomForm = function(value, selectedEndIndex) {
  let RecurrenceCustomFormObject = Object.assign({}, RecurrenceCustomBasicForm);
  switch(selectedEndIndex) {
      case 0:
          RecurrenceCustomFormObject = Object.assign({}, RecurrenceCustomBasicForm);
          break;
      case 1:
          RecurrenceCustomFormObject = Object.assign({}, RecurrenceCustomBasicForm, {until: t.Date});
          break;
      case 2:
          RecurrenceCustomFormObject = Object.assign({}, RecurrenceCustomBasicForm, {count: t.Number});
          break;
      default:
          ;
  }
  return t.struct(RecurrenceCustomFormObject);
};

const Form = t.form.Form;

class EditTimeNotificationRecurrenceCustom extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: "Time Nonification",
        headerRight: <Button type="clear" title="Done" titleStyle={{color: '#5fb8f6'}} onPress={() => params.onDonePress()} />,
        headerLeft: <Button type="clear" title="Cancel" titleStyle={{color: '#fa2662'}} onPress={() => navigation.goBack(null)} />,
      };
  };

  constructor(props, context) {
    super(props);

    const { navigation } = this.props;
    const { recurrence } = this.props.navigation.state.params;

    options.fields.until.config = {
      format: (date) => moment(date).locale('en').format('LL'),
    };

    this.state = {
      value: recurrence,
      type: RecurrenceCustomForm(recurrence, this.initEndIndex(recurrence)),
      options: options,
      selectedEndIndex: this.initEndIndex(recurrence),
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ onDonePress: this.onDonePress.bind(this) });
  }

  initEndIndex(recurrence) {
    let initEndIndex = 0;
    if (recurrence) {
      if (recurrence.until) {
        initEndIndex = 1;
      }
      else if (recurrence.count) {
        initEndIndex = 2;
      }
    }
    return initEndIndex;
  }

  onDonePress() {
    const value = this.refs['form'].getValue();
    if (value) {
      const { onRecurrenceChange } = this.props.navigation.state.params;
      onRecurrenceChange(value);
      this.props.navigation.goBack();
    }
  }

  onChange(value) {
    this.setState({value: value, type: RecurrenceCustomForm(value, this.state.selectedEndIndex)});
  }

  updateEndIndex (selectedEndIndex) {
    this.setState({selectedEndIndex: selectedEndIndex});
    this.setState({value: this.state.value, type: RecurrenceCustomForm(this.state.value, selectedEndIndex)});
    //this.onChange(this.props.recurrence);
  }

  render() {
    return (
      <ScrollView>
        <View style={timeNotificationStyles.container} >
          <Form
            ref='form'
            type={this.state.type}
            options={this.state.options}
            onChange={this.onChange.bind(this)}
            value={this.state.value}
          />
          <ButtonGroup
            onPress={this.updateEndIndex.bind(this)}
            selectedIndex={this.state.selectedEndIndex}
            buttons={buttons}
            containerStyle={{height: 30}}
          />
        </View>
      </ScrollView>
    )
  }
}

export default EditTimeNotificationRecurrenceCustom;
