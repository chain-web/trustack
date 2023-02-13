import { Address } from '../address.js';
import { testDid } from './metaTest.util.js';

describe('Address', () => {
  describe('test', () => {
    it('should create address ok', () => {
      const addr = new Address(testDid);
      expect(addr.did).toEqual(testDid);
    });
  });
});
