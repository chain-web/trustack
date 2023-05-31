/* eslint-disable no-console */
import kill from 'kill-port';
import { testRelayAccounts } from '@trustack/common';
export default async function setup() {
  try {
    await kill(testRelayAccounts[0].tcpPort);
  } catch (_) {}
  console.log('teardown sknode done');
  return;
}
