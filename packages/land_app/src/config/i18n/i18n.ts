import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import type { I18nCinfigItem } from './i18.interface';

const require = import.meta.glob('/**/*.i18n.ts', { eager: true });
const transMap: I18nCinfigItem = {};

for (const key in require) {
  const ele = (require[key] as { default: I18nCinfigItem }).default;
  Object.keys(ele).forEach((lan) => {
    if (!transMap[lan]) {
      transMap[lan] = {
        translations: {},
      };
    }
    transMap[lan].translations = {
      ...transMap[lan].translations,
      ...ele[lan].translations,
    };
  });
}

export default i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: transMap,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    ns: ['translations'],
    defaultNS: 'translations',
  });
