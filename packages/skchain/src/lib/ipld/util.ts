import { createNode } from '@ipld/dag-pb';
import type { PBNode } from '@ipld/dag-pb';
import { bytes } from 'multiformats';
import type { SKDB } from '../ipfs/ipfs.interface.js';

export const createEmptyNode = (name: string): PBNode => {
  return createNode(bytes.fromString(name), []);
};

export const createEmptyNodeCid = async (
  name: string,
  db: SKDB,
): Promise<string> => {
  const storageRoot = await db.dag.put(createEmptyNode(name));
  return storageRoot;
};
