import * as RNLocalize from 'react-native-localize';

import RRule from 'rrule';

import translate from '../../translations';

const translationGetters = {
  he: () => require('./he.js'),
};

let RRULE_language;

const setRRULElanguage = () => {
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

setRRULElanguage();

export default rruleI18NtoText;
