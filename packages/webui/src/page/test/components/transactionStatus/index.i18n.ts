import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      transactionStatus: 'transaction status',
      wait_count: 'wait count',
      wait_map: 'wait map',
      transing_count: 'transing count',
    },
  },
  zh: {
    translations: {
      transactionStatus: 'transaction status',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
