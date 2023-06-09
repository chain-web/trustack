import { blsvrf } from '../../../dist/crypto/index.mjs';
describe('crypto', () => {
  describe('blsvrf', () => {
    it('should blsvrf sign verify ok', async () => {
      const signMsg = new Uint8Array([1, 2, 3]);
      const skData = new Uint8Array([
        0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0a, 0x0b, 0x0c, 0x0d,
        0x0e, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0a, 0x0b,
      ]);
      console.log('skData', skData);
      const sign = await blsvrf.sign(signMsg, skData);
      const sk = await blsvrf.genSecretKeyByData(skData);
      const pk = sk.getPublicKey().serialize();
      const verify = await blsvrf.verify(signMsg, pk, sign);

      expect(verify).toEqual(true);
    });
    it('should uint8ArrayToNumber ok', async () => {
      const uint8Array = new Uint8Array([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf,
      ]);
      const number = blsvrf.uint8ArrayToAvgNumber(uint8Array);
      expect(number).toEqual(8);
    });
    it('should blsvrf sign random ok', async () => {
      let sum = 0;
      const count = 10000;
      const signMsg = new Uint8Array([1, 2, 3]);
      for (let i = 0; i < count; i++) {
        i % (count / 20) === 0 && console.log('step: ', i / count);
        const skData = new Uint8Array(32);
        for (let j = 0; j < 32; j++) {
          // why 100? need more knowledge about bls
          skData[j] = Math.floor(Math.random() * 100);
        }
        const sign = await blsvrf.sign(signMsg, skData);
        const avg = blsvrf.uint8ArrayToAvgNumber(sign);
        if (avg > 128) {
          sum++;
        } else {
          sum--;
        }
      }
      expect(sum / 10).toBeLessThan(1);
    });
  });
});
