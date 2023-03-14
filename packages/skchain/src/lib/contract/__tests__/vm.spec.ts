import { testAccounts } from '../../../../tests/testAccount.js';
import { Address } from '../../../mate/address.js';
import { generateBaseContractCode } from '../codeSnippet.js';
import { evalClass, evalFunction } from '../vm.js';
import { testCoinContract, testCoinContractDid } from './contractTest.util.js';

describe('vm', () => {
  describe('test', () => {
    it('should simple fn ok', async () => {
      const simpleAdd = () => {
        return 1 + 1;
      };
      const res = await evalFunction(simpleAdd.toString());
      expect(res.funcResult).toEqual('2');
      expect(res.cuCost).toEqual('34');
    });
    it('should simple class ok', async () => {
      const codeStr = `
        ${generateBaseContractCode(new Address(testAccounts[0].id))}
        ${testCoinContract}
      `;
      const res = await evalClass(codeStr, 'getBalance', [
        `{did: '${testCoinContractDid}'}`,
      ]);
      expect(res.funcResult).toEqual('10000n');
    });
  });
});
