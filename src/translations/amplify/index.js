import * as RNLocalize from 'react-native-localize';

import { I18n } from 'aws-amplify';

const translationGetters = {
  en: () => null,
  de: () => null,
  fr: () => null,
  es: () => null,
  it: () => null,
  zh: () => null,
  he: () => require('./he.js'),
};

let dict;

const setAmplifyI18nConfig = () => {
  const fallback = { languageTag: "en", isRTL: false };
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

  I18n.setLanguage(languageTag);

  dict = (!['en', 'de', 'fr', 'es', 'it', 'zh'].includes(languageTag)) && translationGetters[languageTag]();

  dict && I18n.putVocabularies(dict);
};

setAmplifyI18nConfig();

export default setAmplifyI18nConfig;
