import { BUILDER_NAMES } from '@faithstack/contract';
import { bytes } from 'multiformats';
import { Contract } from '../index.js';
import { testCoinContract } from './contractTest.util.js';

describe('contract', () => {
  describe('test', () => {
    it('should simple fn ok', async () => {
      const contract = new Contract();
      await contract.init();

      const res = contract.runContract(bytes.fromString(testCoinContract), {
        cuLimit: 10000n,
        storage: bytes.fromString(''),
        method: BUILDER_NAMES.CONSTRUCTOR_METHOD,
      });
      expect(res.funcResult).toEqual('undefined');
    });
  });
});
