import { genLanKeys } from '../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      start: 'start node',
      starting: 'node starting',
      started: 'node running',
    },
  },
  zh: {
    translations: {
      start: '启动节点',
      starting: '节点启动中',
      started: '启动成功',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
