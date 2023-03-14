import { createTestDiskSkMpt } from '../../../lib/skfs/__tests__/utils.js';
import { StateRoot } from '../stateRoot.js';

export const createTestStateRoot = async (
  name?: string,
): Promise<StateRoot> => {
  name = name || 'test_state_root';
  const mpt = await createTestDiskSkMpt(name);
  return new StateRoot({ mpt });
};
