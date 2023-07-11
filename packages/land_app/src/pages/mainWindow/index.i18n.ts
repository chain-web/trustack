import { genLanKeys } from '../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      start: 'start',
    },
  },
  zh: {
    translations: {
      start: '启动',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
