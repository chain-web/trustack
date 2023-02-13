import { genesis } from '../../../../config/testnet.config.js';
import { createTestAccount } from '../../../../mate/__tests__/metaTest.util.js';
import { createGenesisBlock } from '../../../genesis/genesis.util.js';
import {
  closeTestBlockService,
  createTestBlockService,
} from './blockService.util.js';

describe('block service', () => {
  describe('test', () => {
    it('should block root init ok', async () => {
      const blockService = await createTestBlockService({
        name: 'test__block_init',
      });
      await blockService.init();
      await closeTestBlockService(blockService);
    });
    it('should add block ok', async () => {
      const blockService = await createTestBlockService({
        name: 'test__block_add',
      });
      await blockService.init();
      const block = await createGenesisBlock(genesis, 'stateRoot');
      await blockService.addBlock(block);
      const blockBack = await blockService.getBlockByNumber(0n);
      expect(blockBack).not.toEqual(undefined);
      if (blockBack) {
        expect(blockBack.hash).toEqual(block.hash);
      }
      await closeTestBlockService(blockService);
    });
    it('should add account ok', async () => {
      const blockService = await createTestBlockService({
        name: 'test__account_add',
      });
      await blockService.init();
      const account = await createTestAccount();

      await blockService.addAccount(account);
      const accountSaved = await blockService.getExistAccount(
        account.address.did,
      );
      const accountCbor = await accountSaved.toCborBlock();

      const savedCid = await blockService.stateRoot.get(account.address.did);

      expect(accountCbor.cid.bytes).toEqual(savedCid?.bytes);
      await closeTestBlockService(blockService);
    });
  });
});
