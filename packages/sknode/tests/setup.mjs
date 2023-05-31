/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */
import { existsSync, rmdirSync } from 'fs';
import { fork } from 'child_process';
import { $ } from 'execa';
import kill from 'kill-port';
import { wait } from '@trustack/common';
export default async function setup() {
  try {
    await kill(6689);
  } catch (_) {}
  console.log('Setup sknode test');
  const file = '.leveldb/relay-server';
  if (existsSync(file)) {
    rmdirSync(file, { recursive: true });
  }

  const child = fork('packages/sknode/dist/relay.mjs', ['child'], {
    execArgv: ['--experimental-wasm-modules'],
    stdio: 'ignore',
  });

  let isReady = false;
  child.on('message', (msg) => {
    if (msg.data?.match('init error')) {
      console.log(msg);
      throw new Error('init error');
    }
    if (!isReady && msg.data?.match('start at networkOnly mode')) {
      isReady = true;
    }
  });

  while (!isReady) {
    await wait(500);
  }

  console.log('Setup sknode test done');
  return;
}
