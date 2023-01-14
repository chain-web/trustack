import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      login: 'login',
      did: 'did',
      privKey: 'private key',
    },
  },
  zh: {
    translations: {
      login: 'login',
      did: 'did',
      privKey: 'private key',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
