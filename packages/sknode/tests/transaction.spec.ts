import type { DidJson } from '@trustack/common';
import { testAccounts, testContracts, wait } from '@trustack/common';
import { bytes } from 'multiformats';
import { Address, Transaction } from 'skchain';
import { createSubProcessNode } from './util.js';

describe('SkChain transaction', () => {
  describe('multi node test', () => {
    it('should 4 node simple transaction ok', async () => {
      const count = 4;
      // create nodes
      const nodes = [];
      const kills = [];
      const awaitForBlocks = [];
      for (let i = 0; i < count; i++) {
        const port = 3322 + i * 10;
        const { kill, client, awaitForBlock } = await createSubProcessNode({
          port,
          clearDB: true,
          user: testAccounts[i],
        });
        kills.push(kill);
        nodes.push(client);
        awaitForBlocks.push(awaitForBlock);
      }

      // wait for peer connect
      let peerCount = 0;
      while (peerCount < count) {
        // every node connect to each other, and connect to relay node, so peerCount should eqal to count
        await wait(1000);
        const {
          status: { peerCount: pc },
        } = await nodes[0].getNetworkStatus.query();
        peerCount = pc;
      }

      // send transaction
      await nodes[0].transaction.query({
        amount: '1000',
        recipient: testAccounts[3].id,
      });

      // wait for 1 block
      await Promise.all(awaitForBlocks.map((f) => f(1)));
      for (let i = 0; i < count; i++) {
        const { balance } = await nodes[i].getBalance.query(testAccounts[3].id);
        expect(balance).toEqual('1000');
      }

      // kill nodes
      for (let i = 0; i < count; i++) {
        kills[i]();
      }
    });
    it('should 2 node contract call ok', async () => {
      // TDOD test may error
      const count = 2;
      // create nodes
      const nodes = [];
      const kills = [];
      const awaitForBlocks = [];
      for (let i = 0; i < count; i++) {
        const port = 3322 + i * 10;
        let user: DidJson = testAccounts[i];
        if (i === 0) {
          user = testContracts.tokenContract.testAccount;
        }
        const { kill, client, awaitForBlock } = await createSubProcessNode({
          port,
          clearDB: true,
          user,
        });
        kills.push(kill);
        nodes.push(client);
        awaitForBlocks.push(awaitForBlock);
      }

      // wait for peer connect
      let peerCount = 0;
      while (peerCount < count) {
        // every node connect to each other, and connect to relay node, so peerCount should eqal to count
        await wait(1000);
        const {
          status: { peerCount: pc },
        } = await nodes[0].getNetworkStatus.query();
        peerCount = pc;
      }

      // deploy contract
      const { hex: transHex } = await nodes[0].deployContract.query(
        testContracts.tokenContract.code,
      );

      const trans = await Transaction.fromBinary(bytes.fromHex(transHex));
      await Promise.all(awaitForBlocks.map((f) => f(1)));

      // call contract
      const { error } = await nodes[0].callContract.query({
        amount: '0',
        contract: trans.recipient.did,
        method: 'send',
        args: [new Address(testAccounts[2].id).toParam(), '1000n'],
      });

      expect(error).toBeUndefined();

      // send random trans

      // wait for 1 block
      await Promise.all(awaitForBlocks.map((f) => f(1)));
      // TODO
      for (let i = 0; i < count; i++) {
        const { result } = await nodes[i].callContract.query({
          amount: '0',
          contract: trans.recipient.did,
          method: 'getBalance',
          args: [new Address(testAccounts[2].id).toParam()],
        });
        console.log('result: ', i);
        expect(result).toEqual('1000n');
      }

      // kill nodes
      for (let i = 0; i < count; i++) {
        kills[i]();
      }
    });
  });
});
