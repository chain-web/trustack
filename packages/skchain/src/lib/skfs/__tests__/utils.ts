import { Skfs } from '../index.js';

export const createTestSkfs = async (): Promise<Skfs> => {
  const skfs = new Skfs({
    path: 'test_skfs',
    useMemoryBb: true,
  });
  await skfs.open();

  await skfs.clear();

  return skfs;
};

export const createTestDiskSkfs = async (): Promise<Skfs> => {
  const skfs = new Skfs({
    path: 'test_skfs',
  });
  await skfs.open();

  await skfs.clear();

  return skfs;
};
