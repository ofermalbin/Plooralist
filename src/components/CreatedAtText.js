import React from 'react';
import { Text, StyleSheet } from 'react-native';

import moment from 'moment/min/moment-with-locales.js';

import translates, { getI18nConfig } from '../translations';

import { createByAtStyles } from '../config/stylesheets';

const CreatedAt = (props) => {
  const { languageTag, isRTL } = getI18nConfig();
  return (
    <Text style={createByAtStyles.text}>{`${translates("Common.Message.created at")} ${moment(props.createdAt).locale(languageTag).format('LL')}.`}</Text>
  );
};

export default CreatedAt;
