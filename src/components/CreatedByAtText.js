import React from 'react';
import { View, Text } from 'react-native';

import { TextNameUser } from '../screens/users';

import moment from 'moment/min/moment-with-locales.js';

import translate, { getI18nConfig } from '../translations';

import { createByAtStyles } from '../config/stylesheets';

export const CreatedByText = (props) => {
  return (
    <View style={[createByAtStyles.container, {flexDirection: 'row'}]}>
      <Text style={createByAtStyles.text}>{`${translate("Common.Info.created by")} `}</Text>
      <TextNameUser style={createByAtStyles.text} user={props.user} />
      <Text style={createByAtStyles.text}>{`${'.'}`}</Text>
    </View>
  );
};

export const CreatedAtText = (props) => {
  const { languageTag, isRTL } = getI18nConfig();
  return (
    <View style={createByAtStyles.container}>
      <Text style={createByAtStyles.text}>{`${translate("Common.Info.created at")} ${moment(props.createdAt).locale(languageTag).format('LL')}.`}</Text>
    </View>
  );
};
