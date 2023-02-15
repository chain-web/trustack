import { evalFunction } from '../skvm.js';

describe('skvm', () => {
  describe('test', () => {
    it('should simple fn ok', async () => {
      const simpleAdd = () => {
        return 1 + 1;
      };
      const res = await evalFunction(simpleAdd.toString());
      expect(res).toEqual('2');
    });
  });
});
