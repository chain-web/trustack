import { createTestDiskSkMpt } from '../../../lib/skfs/__tests__/utils.js';
import { StateRoot } from '../stateRoot.js';

export const createTestStateRoot = (name?: string): StateRoot => {
  name = name || 'test_state_root';
  const mpt = createTestDiskSkMpt(name);
  return new StateRoot({ mpt });
};
