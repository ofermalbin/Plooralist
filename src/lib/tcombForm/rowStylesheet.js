import t from 'tcomb-form-native';

import _ from 'lodash';

const rowStylesheet = _.cloneDeep(t.form.Form.stylesheet);

rowStylesheet.formGroup.normal.flexDirection = 'row';
rowStylesheet.formGroup.normal.justifyContent = 'space-between';
rowStylesheet.formGroup.normal.alignItems = 'center';
rowStylesheet.formGroup.error.flexDirection = 'row';
rowStylesheet.formGroup.error.justifyContent = 'space-between';
rowStylesheet.formGroup.error.alignItems = 'center';
rowStylesheet.textbox.normal.flex = 1;
rowStylesheet.textbox.error.flex = 1;

export default rowStylesheet;
