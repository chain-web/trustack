import { testAccounts } from '../../../../tests/testAccount.js';
import { genesis } from '../../../config/testnet.config.js';
import { createTestBlockService } from '../../ipld/blockService/__tests__/blockService.util.js';
import { Genesis } from '../index.js';

describe('Genesis', () => {
  describe('test', () => {
    it('should Genesis check ok', async () => {
      const { bs, close } = await createTestBlockService({
        name: 'test__genesis_check',
      });
      const gs = new Genesis(bs, genesis);
      await gs.checkGenesisBlock();
      const block0 = await bs.getBlockByNumber(0n);
      expect(block0).not.toEqual(undefined);
      if (block0) {
        expect(block0.header.number).toEqual(0n);
      }

      const account = await bs.getExistAccount(testAccounts[0].id);
      expect((await account.toCborBlock()).cid.toString()).toEqual(
        (await bs.stateRoot.get(account.address.did))?.toString(),
      );

      await close();
    });
  });
});
