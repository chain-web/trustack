import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      repoStatus: 'repo status',
    },
  },
  zh: {
    translations: {
      repoStatus: 'repo status',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
