import { bytes } from 'multiformats';
import { sleep } from '../../../../tests/skchainTest.util.js';
import { testAccounts } from '../../../../tests/testAccount.js';
import { PubsubTopic } from '../network.js';
import { createTestSkNetWork } from './utils.js';

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
      const { network: n3, close: c3 } = await createTestSkNetWork(
        4320,
        6932,
        testAccounts[2],
      );
      // console.log('create network ok');
      let msg1 = '';
      let msg2 = '';
      const msg3: string[] = [];

      n1.subscribe(PubsubTopic.DID, (data) => {
        msg1 = bytes.toString(data);
      });
      n2.subscribe(PubsubTopic.DID, (data) => {
        msg2 = bytes.toString(data);
      });
      n3.subscribe(PubsubTopic.DID, (data) => {
        msg3.push(bytes.toString(data));
      });

      await n1.network.node.peerStore.addressBook.set(
        n2.network.node.peerId,
        n2.network.node.getMultiaddrs(),
      );
      await n1.network.node.dial(n2.network.node.peerId);

      await n2.network.node.peerStore.addressBook.set(
        n3.network.node.peerId,
        n3.network.node.getMultiaddrs(),
      );
      await n2.network.node.dial(n3.network.node.peerId);
      await sleep(400);

      await n1.publish(PubsubTopic.DID, bytes.fromString('hello'));
      await sleep(100);
      await n2.publish(PubsubTopic.DID, bytes.fromString('world'));
      await sleep(100);

      expect(msg1).toBe('world');
      expect(msg2).toBe('hello');
      expect(msg3[0]).toEqual('hello');

      await c1();
      await c2();
      await c3();
    }, 12000);
  });
});
