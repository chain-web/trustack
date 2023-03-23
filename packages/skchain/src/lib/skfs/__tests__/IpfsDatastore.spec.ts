import { Key } from 'interface-datastore';
import { bytes } from 'multiformats';
import { IpfsDatastore } from '../ipfsDatastore.js';

describe('IpfsDatastore', () => {
  describe('test', () => {
    it('should disk simple use ok', async () => {
      const ds = new IpfsDatastore('test__ipfsDatastore');
      await ds.open();
      await ds.put(new Key('tets_key'), bytes.fromString('testValue'));
      const has = await ds.has(new Key('tets_key'));
      expect(has).toEqual(true);
      const data = await ds.get(new Key('tets_key'));
      expect(bytes.toString(data)).toEqual('testValue');
      await ds.delete(new Key('tets_key'));
      const has2 = await ds.has(new Key('tets_key'));
      expect(has2).toEqual(false);
      await ds.close();
      try {
        await ds.put(new Key('tets_key'), bytes.fromString('testValue'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.message).toEqual('Database is not open');
      }
    });
  });
});
