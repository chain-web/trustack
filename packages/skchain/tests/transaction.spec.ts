import { LifecycleStap, testAccounts, testContracts } from '@trustack/common';
import { bytes } from 'multiformats';
import { TransStatus } from '../src/lib/transaction/index.js';
import { Address } from '../src/mate/address.js';
import { createTestSkChain } from './skchainTest.util.js';

describe('SkChain transaction', () => {
  describe('single node test', () => {
    it('should transaction ok', async () => {
      const chain = await createTestSkChain('transaction');
      await chain.run({ user: testAccounts[0] });
      const { trans } = await chain.transaction({
        amount: 10n,
        recipient: new Address(testAccounts[4].id),
      });
      expect(chain.transAction.status.waitTransCount).toEqual(1);
      if (trans) {
        const status = await chain.transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.waiting);
      }
      // wait to stack
      await chain.chainState.waitForLifecycle(LifecycleStap.newBlock);
      expect(trans).not.toEqual(undefined);
      if (trans) {
        const status = await chain.transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.transed);
      }
      // check balance
      const balance = (await chain.getAccount(testAccounts[4].id))?.getBlance();
      expect(balance).toEqual(10n);
      await chain.stop();
      // performanceCollecter.enabled && performanceCollecter.print();
    });
    it('should deploy and call contract at two ok', async () => {
      const chain = await createTestSkChain('contract_2');
      await chain.run({ user: testContracts.tokenContract.testAccount });

      const { trans } = await chain.deploy({
        payload: bytes.fromString(testContracts.tokenContract.code),
      });

      if (!trans) {
        throw new Error('no trans');
      }
      // wait to stack
      await chain.chainState.waitForLifecycle(LifecycleStap.newBlock);
      const status = await chain.transAction.transStatus(trans.hash);
      expect(status.status).toEqual(TransStatus.transed);
      // call contract
      const { result } = await chain.callContract({
        amount: 0n,
        contract: trans.recipient,
        method: 'send',
        args: [new Address(testAccounts[0].id).toParam(), 100n],
      });
      expect(result).toEqual(true);
      // wait to stack
      await chain.chainState.waitForLifecycle(LifecycleStap.newBlock);
      const { result: getBalanceRes } = await chain.callContract({
        amount: 0n,
        contract: trans.recipient,
        method: 'getBalance',
        args: [new Address(testAccounts[0].id).toParam()],
      });
      expect(getBalanceRes).toEqual('100n');
      await chain.stop();
    });
    it('should deploy and call contract at one block ok', async () => {
      const chain = await createTestSkChain('contract_1');
      await chain.run({ user: testAccounts[2] });

      const { trans } = await chain.deploy({
        payload: bytes.fromString(testContracts.tokenContract.code),
      });

      if (!trans) {
        throw new Error('no trans');
      }
      // TODO: can deploy and call contract at one block
      // const { result } = await chain.callContract({
      //   amount: 0n,
      //   contract: trans.recipient,
      //   method: 'send',
      //   args: [new Address(testAccounts[0].id).toParam(), 100n],
      // });
      // expect(result).toEqual(true);
      // // wait to stack
      // await chain.chainState.waitForLifecycle(LifecycleStap.newBlock);
      // const { result: getBalanceRes } = await chain.callContract({
      //   amount: 0n,
      //   contract: trans.recipient,
      //   method: 'getBalance',
      //   args: [new Address(testAccounts[0].id).toParam()],
      // });
      // expect(getBalanceRes).toEqual('100n');
      await chain.stop();
    });
  });
});
