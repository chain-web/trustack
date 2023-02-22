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
      expect(res[0]).toEqual('2');
      expect(res[1]).toEqual('34');
    });
    it('should simple class ok', async () => {
      const codeStr = `
        ${generateBaseContractCode()}
        ${testCoinContract}
      `;
      const res = await evalClass(codeStr, 'getBalance', [
        `{did: '${testCoinContractDid}'}`,
      ]);
      expect(res[0]).toEqual('10000n');
    });
  });
});
