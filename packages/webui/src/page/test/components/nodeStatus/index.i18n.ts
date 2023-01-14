import { genLanKeys } from '../../../../config/i18n/i18.interface';

const lans = {
  en: {
    translations: {
      node_status: 'node status',
      sliceName: 'current slice key',
      slicePeerSize: 'current slice peer count',
      slicePeerList: 'peer list',
      sliceStatus: 'slice status',
      consensusStatus: 'consensus status',
      blockMsg: 'block msg',
      blockNumber: 'block number',
      blockHesh: 'block hesh',
      blockCid: 'block cid',
      accountBalance: 'account balance',
      accountNonce: 'account nonce',
    },
  },
  zh: {
    translations: {
      node_status: 'node status',
      sliceName: '当前分片',
      slicePeerSize: '当前分片节点数',
      slicePeerList: '节点列表',
      sliceStatus: 'slice status',
      consensusStatus: 'consensus status',
      blockMsg: 'block msg',
      blockNumber: 'block number',
      blockHesh: 'block hesh',
      blockCid: 'block cid',
      accountBalance: 'account balance',
      accountNonce: 'account nonce',
    },
  },
};

export default lans;

export const lanKeys = genLanKeys(lans);
