import { bytes } from 'multiformats';
// jest not support esm, so use dist/index.mjs
// bad import, but it's ok for test
import { evaluate } from '../dist/index.mjs';

describe('contract evaluate', () => {
  describe('test', () => {
    it('should simple evaluate ok', async () => {
      const add = () => {
        return 1 + 1;
      };
      const codeStr = [
        `
        const add  = ${add.toString()}`,
        `
        add()
      `,
      ];
      const res = evaluate({
        codeString: codeStr,
        cuLimit: 100n,
        storage: bytes.fromString(''),
      });
      expect(res.funcResult).toEqual('2');
      expect(res.cuCost).toEqual(['8', '30']);
    });
  });
});
