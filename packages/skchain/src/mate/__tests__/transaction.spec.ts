import { Address } from '../address.js';
import { Transaction } from '../transaction.js';

const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
const createTestTranscation = () => {
  return new Transaction({
    from: new Address(testDid),
    accountNonce: 1n,
    cu: 1n,
    cuLimit: 10n,
    recipient: new Address(testDid),
    amount: 1n,
    ts: Date.now(),
  });
};

describe('Transaction', () => {
  describe('test', () => {
    it('should create transcation ok', () => {
      const trans = createTestTranscation();
      expect(trans.amount).toEqual(1n);
    });

    it('should transcation cbor block ok', async () => {
      const trans = createTestTranscation();
      const binary = await trans.toCborBlock();
      const transBack = await Transaction.fromBinary(binary.bytes);
      expect(transBack.amount).toEqual(1n);
    });
  });
});
