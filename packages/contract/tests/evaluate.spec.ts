import { bytes } from 'multiformats';
import { evaluate } from '../src/index.js';

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
      expect(res.cuCost).toEqual(['6', '22']);
    });
  });
});
