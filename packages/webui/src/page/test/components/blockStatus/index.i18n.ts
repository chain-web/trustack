import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      blockStatus: 'block status',
    },
  },
  zh: {
    translations: {
      blockStatus: 'block status',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
