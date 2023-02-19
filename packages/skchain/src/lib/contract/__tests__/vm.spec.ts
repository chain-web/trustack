import { baseContractCode } from '../codeSnippet.js';
import { evalClass, evalFunction } from '../vm.js';
import { testCoinContract, testCoinContractDid } from './contractTest.util.js';

describe('vm', () => {
  describe('test', () => {
    it('should simple fn ok', async () => {
      const simpleAdd = () => {
        return 1 + 1;
      };
      const res = await evalFunction(simpleAdd.toString());
      expect(res).toEqual('2');
    });
    it('should simple class ok', async () => {
      const codeStr = `
        ${baseContractCode}
        ${testCoinContract}
      `;
      const res = await evalClass(codeStr, 'getBalance', [
        `{did: '${testCoinContractDid}'}`,
      ]);
      expect(res).toEqual('10000n');
    });
  });
});
