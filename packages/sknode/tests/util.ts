/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */
import { fork } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { $ } from 'execa';
import { wait } from '@trustack/common';
import { createRPCClient } from '../dist/rpc/client.mjs';
const __filename = fileURLToPath(import.meta.url);
export const createSubProcessNode = async (opts: {
  port: string;
  clearDB?: boolean;
  userIndex?: number; // default is generate a new user
}): Promise<{
  kill: () => void;
  client: ReturnType<typeof createRPCClient>;
}> => {
  const { port, clearDB } = opts;
  if (clearDB) {
    await $`rm -rf ./.leveldb/${port}`;
    console.log(`clear db: `, port);
  }

  const __dirname = dirname(__filename);
  const path = join(__dirname, '../dist', 'index.mjs');
  const child = fork(path, ['child'], {
    env: {
      RPC_PORT: port,
      TCP_PORT: port + 1,
      WS_PORT: port + 2,
      USER_INDEX: opts.userIndex?.toString(),
    },
    execArgv: ['--experimental-wasm-modules'],
    stdio: 'ignore',
  });

  let isReady = false;
  child.on('message', (msg: { type: string; data?: string }) => {
    if (!isReady && msg.data?.match('rpc server start')) {
      isReady = true;
    }
  });

  while (!isReady) {
    await wait(500);
  }

  const client = await createRPCClient(port);

  const safeKill = () => {
    try {
      child.kill();
    } catch (error) {
      console.log('abort error: ', error);
    }
  };

  return { kill: safeKill, client };
};
