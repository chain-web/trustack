import { Address } from '../address.js';
import { Receipt } from '../receipt.js';

const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
const createTestReceipt = () => {
  return new Receipt({
    blockNumber: BigInt(1),
    cuUsed: BigInt(20),
    from: new Address(testDid),
    logs: [],
    status: 1,
    to: new Address(testDid),
    transaction: '',
    transactionIndex: 2,
    updates: [],
  });
};

describe('Receipt', () => {
  describe('test', () => {
    it('should Receipt cbor block ok', async () => {
      const receipt = createTestReceipt();
      const binary = await receipt.toCborBlock();
      const receiptBack = await Receipt.fromBinary(binary.bytes);
      expect(receiptBack.receiptData.cuUsed).toEqual(20n);
    });
  });
});
