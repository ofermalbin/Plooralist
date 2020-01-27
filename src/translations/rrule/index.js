import * as RNLocalize from 'react-native-localize';

import RRule from 'rrule';

const translationGetters = {
  he: () => require('./he.js'),
};

let RRULE_language;

export const setRruleI18nConfig = () => {
  const fallback = { languageTag: "en", isRTL: false };
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

  RRULE_language = (languageTag != 'en') && translationGetters[languageTag]();
};

const rruleI18NtoText = (rrule) => {
  if (RRULE_language) {
    const gettext = id => {
        return RRULE_language.RRULE_Strings[id] || id;
    };
    return rrule.toText(gettext, RRULE_language.RRULE_Names);
  }
  else {
    return rrule.toText();
  }
};
export default rruleI18NtoText;

setRruleI18nConfig();
