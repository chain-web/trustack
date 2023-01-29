import { createBlock } from '../utils.js';

describe('Account', () => {
  const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
  describe('test', () => {
    it('should create address ok', async () => {
      const block = await createBlock({ did: testDid });
      expect(block.value.did).toEqual(testDid);
    });
  });
});
