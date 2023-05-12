import { Transaction } from '../transaction.js';
import { createTestTranscation } from './metaTest.util.js';

describe('Transaction', () => {
  describe('test', () => {
    it('should create transcation ok', async () => {
      const trans = await createTestTranscation();
      expect(trans.amount).toEqual(1n);
    });

    it('should transcation cbor block ok', async () => {
      const trans = await createTestTranscation();
      const binary = await trans.toCborBlock();
      const transBack = await Transaction.fromBinary(binary.bytes);
      expect(transBack.amount).toEqual(1n);
    });
  });
});
