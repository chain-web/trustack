import type { BlockView, CID } from 'multiformats';
import * as Block from 'multiformats/block';
import * as codec from '@ipld/dag-cbor';
import { sha256 as hasher } from 'multiformats/hashes/sha2';

// 113 = codec of @ipld/dag-cbor
// 18 = sha256 hasher code
export type DefaultBlockType<T> = BlockView<T, 113, 18, 1>;

// generate init account storageRoot
export const createEmptyStorageRoot = async (): Promise<CID> => {
  const block = await createBlock<[]>([]);
  return block.cid;
};

export const createBlock = async <T>(
  value: T,
): Promise<DefaultBlockType<T>> => {
  const block = await Block.encode<T, 113, 18>({ value, codec, hasher });
  return block;
};
