// MultiSelect.js
import React from 'react';
import { View, Text } from 'react-native';
import t from 'tcomb-form-native';
import Checkbox from 'react-native-checkbox';
import _ from 'lodash';

class TcombMultiSelect extends t.form.Select {
  constructor(props) {
    super(props);
    const locals = super.getLocals();
    const isChecked = {};
    const { options, value } = locals;

   options && options.map(item => (isChecked[item.value] = !!_.find(value, _value => _value === item.value)));

    this.state = {
      isChecked,
    };

    this._onChange = this._onChange.bind(this);
  }

  getTransformer() {
    return TcombMultiSelect.transformer();
  }

  getTemplate() {
    return (locals) => {
      const stylesheet = locals.stylesheet;
      let formGroupStyle = stylesheet.formGroup.normal;
      let controlLabelStyle = stylesheet.controlLabel.normal;
      let checkboxStyle = stylesheet.checkbox.normal;
      let helpBlockStyle = stylesheet.helpBlock.normal;
      const errorBlockStyle = stylesheet.errorBlock;

      if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        checkboxStyle = stylesheet.checkbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
      }

      const label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
      const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
      const error =
        locals.hasError && locals.error ? (
          <Text style={errorBlockStyle}>{locals.error}</Text>
        ) : null;

      const viewArr = [];

      locals.options.map((item, index) =>
        viewArr.push(<Checkbox
            key={index}
            ref={item.value}
            label={item.text}
            checked={this.state.isChecked[item.value]}
            onChange={(checked) => {
              this._onChange(item, locals, !checked);
            }}
          />, ), );

      return (
        <View style={formGroupStyle}>
          {label}
          {viewArr}
          {help}
          {error}
        </View>
      );
    };
  }

  getOptions() {
    const { options } = this.props;
    const items = options.options ? options.options.slice() : this.getOptionsOfEnum(this.getEnum());
    if (options.order) {
      items.sort(this.getComparator(options.order));
    }
    return items;
  }

  _onChange(item, locals, checked) {
    const { isChecked } = this.state;
    isChecked[item.value] = checked;
    const changeArr = [];

    _.forIn(isChecked, (isCheckedItem, key) => {
      isCheckedItem && changeArr.push(key);
    });

    locals.onChange(changeArr);

    this.setState({
      isChecked,
    });
  }
}

TcombMultiSelect.transformer = () => ({
  format: value => (Array.isArray(value) ? value : null),
  parse: value => (Array.isArray(value) ? value.map(Number) : null),
});

export default TcombMultiSelect;
