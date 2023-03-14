import { Skfs } from '../index.js';
import { Mpt } from '../mpt.js';

export const createTestSkMpt = (): Mpt => {
  return new Mpt('test_mpt', { useMemDb: true });
};

export const createTestDiskSkMpt = async (name: string): Promise<Mpt> => {
  await rmDbFile(name);
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
  await rmDbFile(name);
  const skfs = new Skfs({
    path: name,
  });
  await skfs.open();

  await skfs.clear();

  return skfs;
};

const rmDbFile = async (name: string = '') => {
  let isNodejs = false;
  try {
    // eslint-disable-next-line import/no-nodejs-modules
    await import('fs');
    isNodejs = true;
  } catch (error) {}
  if (isNodejs) {
    // eslint-disable-next-line import/no-nodejs-modules
    const { resolve } = (await import('path')).default;
    // eslint-disable-next-line import/no-nodejs-modules
    const { existsSync, rmSync } = (await import('fs')).default;

    const dbFile = resolve(process.cwd(), `.leveldb/${name}`);
    if (existsSync(dbFile)) {
      rmSync(dbFile, { recursive: true, force: true });
    }
  }
};
