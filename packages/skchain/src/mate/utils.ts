import type { BlockView, CID } from 'multiformats';
import * as Block from 'multiformats/block';
import * as codec from '@ipld/dag-cbor';
import { sha256 as hasher } from 'multiformats/hashes/sha2';

// 113 = codec of @ipld/dag-cbor
// 18 = sha256 hasher code
export type DefaultBlockCodec = 113;
export type DefaultBlockHasher = 18;
export type DefaultBlockType<T> = BlockView<
  T,
  DefaultBlockCodec,
  DefaultBlockHasher,
  1
>;

// generate init account storageRoot
export const createEmptyStorageRoot = async (): Promise<CID> => {
  const block = await createCborBlock<[]>([]);
  return block.cid;
};

export const createCborBlock = async <T>(
  value: T,
): Promise<DefaultBlockType<T>> => {
  const block = await Block.encode<T, DefaultBlockCodec, DefaultBlockHasher>({
    value,
    codec,
    hasher,
  });
  return block;
};

export const takeBlockValue = async <T>(data: Uint8Array): Promise<T> => {
  const value = await Block.decode<T, DefaultBlockCodec, DefaultBlockHasher>({
    bytes: data,
    codec,
    hasher,
  });
  return value.value;
};
