/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */
import { fork } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { $ } from 'execa';
import type { ChildProcessMessage, DidJson } from '@trustack/common';
import { LifecycleStap, peerid, wait } from '@trustack/common';
import { createRPCClient } from '../dist/rpc/client.mjs';
const __filename = fileURLToPath(import.meta.url);
export const createSubProcessNode = async (opts: {
  port: number;
  clearDB?: boolean;
  user?: DidJson; // default is generate a new user
}): Promise<{
  kill: () => void;
  client: ReturnType<typeof createRPCClient>;
  awaitForBlock: (n: number) => Promise<boolean>;
}> => {
  const { port, clearDB } = opts;
  if (clearDB) {
    await $`rm -rf ./.leveldb/${port}`;
  }

  const __dirname = dirname(__filename);
  const path = join(__dirname, '../dist', 'index.mjs');
  const user = opts.user || (await peerid.genetateDid());
  const child = fork(path, ['child'], {
    env: {
      RPC_PORT: port.toString(),
      TCP_PORT: (port + 1).toString(),
      WS_PORT: (port + 2).toString(),
      DID_PK: user.pubKey,
      DID_SK: user.privKey,
      DID_ID: user.id,
    },
    execArgv: ['--experimental-wasm-modules'],
    silent: true,
  });

  let isReady = false;
  child.on('message', (msg: ChildProcessMessage) => {
    // check node if ready
    if (!isReady && msg.type === 'log' && msg.data?.match('rpc server start')) {
      isReady = true;
    }
  });

  child.stderr?.on('data', (data) => {
    console.log(port, `:stderr: ${data}`);
  });

  while (!isReady) {
    await wait(500);
  }

  const client = await createRPCClient(port);
  let rpcReady = false;
  while (!rpcReady) {
    try {
      const ac = new AbortController();
      const timer = setTimeout(() => {
        ac.abort();
      }, 1000);
      await client.ping.query(undefined, { signal: ac.signal });
      rpcReady = true;
      clearTimeout(timer);
    } catch (error) {
      await wait(500);
    }
  }

  const safeKill = () => {
    try {
      child.kill();
    } catch (error) {
      console.log('abort error: ', error);
    }
  };

  const awaitForBlock = (n: number): Promise<boolean> => {
    return new Promise((resolve) => {
      let count = 0;
      child.on('message', (msg: ChildProcessMessage) => {
        if (msg?.type === 'lifecycleChange') {
          const [step, data] = msg.data;
          if (step === LifecycleStap.newBlock) {
            count++;
            if (count >= n) {
              resolve(true);
            }
          }
        }
      });
    });
  };
  console.log(`created: `, port);

  return { kill: safeKill, client, awaitForBlock };
};
