import { bytes } from 'multiformats';
import { testAccounts, wait } from '@trustack/common';
import { PubsubTopic } from '../network.js';
import { connect2Network, createTestSkNetWork } from './utils.js';

describe('Sknetwork', () => {
  describe(`test`, () => {
    it('should sknetwork pub sub ok', async () => {
      const { network: n1, close: c1 } = await createTestSkNetWork(
        4020,
        6632,
        testAccounts[0],
      );
      const { network: n2, close: c2 } = await createTestSkNetWork(
        4120,
        6732,
        testAccounts[1],
      );
      // console.log('create network ok');
      let msg1 = '';

      n1.subscribe(PubsubTopic.DID, (data) => {
        msg1 = bytes.toString(data);
      });

      await connect2Network(n1, n2);

      await wait(5000);

      await n2.publish(PubsubTopic.DID, bytes.fromString('test_did'));

      while (msg1 === '') {
        await wait(1000);
      }

      expect(msg1).toBe('test_did');

      await c1();
      await c2();
    });
    it('should sknetwork ping ok', async () => {
      const { network: n1, close: c1 } = await createTestSkNetWork(
        4020,
        6632,
        testAccounts[0],
      );
      const { network: n2, close: c2 } = await createTestSkNetWork(
        4120,
        6732,
        testAccounts[1],
      );
      const addr2 = n2.network.node.getMultiaddrs();
      const ping1 = await n1.ping(addr2, 20000);
      expect(ping1).toBeLessThan(10000);
      expect(ping1).toBeGreaterThan(0);
      await c2();
      const ping2 = await n1.ping(addr2, 20000);
      expect(ping2).toBeLessThan(0);
      await c1();
    }, 30000);
  });
});
