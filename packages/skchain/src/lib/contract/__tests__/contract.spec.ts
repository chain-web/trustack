import { CONSTRUCTOR_METHOD } from '@faithstack/contract';
import { bytes } from 'multiformats';
import { testAccounts } from '../../../../tests/testAccount.js';
import { Address, Transaction } from '../../../index.js';
import { Contract } from '../index.js';
import { testCoinContract } from './contractTest.util.js';

describe('contract', () => {
  describe('test', () => {
    it('should simple fn ok', async () => {
      const contract = new Contract();
      await contract.init();
      const trans = new Transaction({
        from: new Address(testAccounts[0].id),
        accountNonce: 1n,
        cu: 1n,
        cuLimit: 10n,
        recipient: new Address(testAccounts[1].id),
        amount: 1n,
        ts: Date.now(),
        payload: {
          method: CONSTRUCTOR_METHOD,
          args: [],
        },
      });
      const res = contract.runContract(
        bytes.fromString(testCoinContract),
        trans,
        10000n,
        bytes.fromString(''),
      );
      expect(res[0]).toEqual('undefined');
    });
  });
});
