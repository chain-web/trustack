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

      await wait(1000);

      await n2.publish(PubsubTopic.DID, bytes.fromString('test_did'));
      await wait(2000);

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
      const sig1 = new AbortController();
      const timeout1 = setTimeout(() => {
        sig1.abort();
      }, 10000);
      const ping1 = await n1.network.node.services.ping.ping(addr2, {
        signal: sig1.signal,
      });
      clearTimeout(timeout1);
      expect(ping1).toBeLessThan(5000);
      await c2();
      await wait(1000);
      let conn2Error = false;
      const sig2 = new AbortController();
      const timeout2 = setTimeout(() => {
        sig2.abort();
      }, 10000);
      try {
        await n1.network.node.services.ping.ping(addr2, {
          signal: sig2.signal,
        });
      } catch (error) {
        // console.log(error);
        conn2Error = true;
      }
      clearTimeout(timeout2);
      expect(conn2Error).toBeTruthy();
      await c1();
    }, 30000);
  });
});
