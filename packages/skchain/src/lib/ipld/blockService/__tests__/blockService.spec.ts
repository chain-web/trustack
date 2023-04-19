import { genesis } from '../../../../config/testnet.config.js';
import { createTestAccount } from '../../../../mate/__tests__/metaTest.util.js';
import { createGenesisBlock } from '../../../genesis/genesis.util.js';
import { createTestBlockService } from './blockService.util.js';

describe('block service', () => {
  describe('test', () => {
    it('should block root init ok', async () => {
      const { bs, close } = await createTestBlockService({
        name: 'test__block_init',
      });
      await bs.init();
      await close();
    });
    it('should add block ok', async () => {
      const { bs, close } = await createTestBlockService({
        name: 'test__block_add',
      });
      await bs.init();
      const block = await createGenesisBlock(genesis, 'stateRoot');
      await bs.addBlock(block);
      const blockBack = await bs.getBlockByNumber(0n);
      expect(blockBack).not.toEqual(undefined);
      if (blockBack) {
        expect(blockBack.hash).toEqual(block.hash);
      }
      await close();
    });
    it('should add account ok', async () => {
      const { bs, close } = await createTestBlockService({
        name: 'test__account_add',
      });
      await bs.init();
      const account = await createTestAccount();

      await bs.addAccount(account);
      const accountSaved = await bs.getExistAccount(account.address.did);
      const accountCbor = await accountSaved.toCborBlock();

      const savedCid = await bs.stateRoot.get(account.address.did);

      expect(accountCbor.cid.bytes).toEqual(savedCid?.bytes);
      await close();
    });
  });
});
