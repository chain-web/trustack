import { Address } from '../address.js';

describe('Address', () => {
  const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
  describe('test', () => {
    it('should create address ok', () => {
      const addr = new Address(testDid);
      expect(addr.did).toEqual(testDid);
    });
  });
});
