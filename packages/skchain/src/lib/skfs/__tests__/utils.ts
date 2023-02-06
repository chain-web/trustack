/* eslint-disable import/no-nodejs-modules */
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';
import { Skfs } from '../index.js';
import { Mpt } from '../mpt.js';

export const createTestSkMpt = (): Mpt => {
  return new Mpt('test_mpt', { useMemDb: true });
};

export const createTestDiskSkMpt = (name: string): Mpt => {
  const dbFile = resolve(process.cwd(), `.leveldb/${name}`);
  if (existsSync(dbFile)) {
    rmSync(dbFile, { recursive: true, force: true });
  }
  const mpt = new Mpt(name);
  return mpt;
};

export const createTestSkfs = async (): Promise<Skfs> => {
  const skfs = new Skfs({
    path: 'test__skfs',
    useMemoryBb: true,
  });
  await skfs.open();

  await skfs.clear();

  return skfs;
};

export const createTestDiskSkfs = async (name?: string): Promise<Skfs> => {
  name = name || 'test__skfs';
  const dbFile = resolve(process.cwd(), `.leveldb/${name}`);
  if (existsSync(dbFile)) {
    rmSync(dbFile, { recursive: true, force: true });
  }
  const skfs = new Skfs({
    path: name,
  });
  await skfs.open();

  await skfs.clear();

  return skfs;
};
