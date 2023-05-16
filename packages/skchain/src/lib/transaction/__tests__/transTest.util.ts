import type { DidJson } from '@trustack/common';
import { newAccount } from '../../../mate/account.js';
import { createEmptyStorageRoot } from '../../../mate/utils.js';
import { createTestConsensus } from '../../consensus/__tests__/consensusTest.util.js';
import { skCacheKeys } from '../../skfs/key.js';
import { createTestBlockService } from '../../ipld/blockService/__tests__/blockService.util.js';
import { TransactionAction } from '../index.js';

export const createTestTransAction = async (
  name: string,
  user: DidJson,
): Promise<{ transAction: TransactionAction; close: () => void }> => {
  const { bs, close: cbs } = await createTestBlockService({ name });
  const { consensus, close: cc } = await createTestConsensus({
    db: bs.db,
    blockService: bs,
  });
  await bs.db.cachePut(skCacheKeys.accountId, user.id);
  await bs.db.cachePut(skCacheKeys.accountPrivKey, user.privKey);

  await bs.addAccount(newAccount(user.id, await createEmptyStorageRoot()));

  await consensus.init();
  const transAction = new TransactionAction(bs, consensus);
  return {
    transAction,
    close: async () => {
      // must close consensus first, it will close network and blockdb
      await cc();
      // then close blockService, it will close skfs and other db
      await cbs();
      await transAction.stop();
    },
  };
};
