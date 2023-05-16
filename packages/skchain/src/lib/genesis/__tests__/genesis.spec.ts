import { testAccounts } from '@trustack/common';
import { createTestBlockService } from '../../ipld/blockService/__tests__/blockService.util.js';
import { chainState } from '../../state/index.js';
import { genInitOption } from '../../state/initOption.js';
import { Genesis } from '../index.js';

describe('Genesis', () => {
  describe('test', () => {
    it('should Genesis check ok', async () => {
      const { bs, close } = await createTestBlockService({
        name: 'test__genesis_check',
      });
      chainState.send('INITIALIZE', {
        data: await genInitOption({ db: bs.db, blockService: bs }),
      });
      const gs = new Genesis(bs);
      await gs.checkGenesisBlock();
      const block0 = await bs.getBlockByNumber(0n);
      expect(block0).not.toEqual(undefined);
      if (block0) {
        expect(block0.header.number).toEqual(0n);
      }

      const size = await bs.stateRoot.size();
      expect(size).toEqual(Object.keys(gs.genesis.alloc || {}).length);

      const account = await bs.getExistAccount(testAccounts[0].id);
      expect((await account.toCborBlock()).cid.toString()).toEqual(
        (await bs.stateRoot.get(account.address.did))?.toString(),
      );

      await close();
    });
  });
});
