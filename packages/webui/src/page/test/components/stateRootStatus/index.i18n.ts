import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      stateRootStatus: 'state root status',
    },
  },
  zh: {
    translations: {
      stateRootStatus: 'state root status',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
