import type { DidJson } from '@trustack/common';
import { testAccounts } from '@trustack/common';
import { genetateDid } from 'skchain';

export const rpcPort = +(process.env.RPC_PORT || 3666);
export const wsPort = +(process.env.WS_PORT || 3667);
export const tcpPort = +(process.env.TCP_PORT || 3668);
export const getUser = async (): Promise<DidJson> => {
  if (process.env.USER_INDEX) {
    const user = testAccounts[+process.env.USER_INDEX];
    if (user) {
      return user;
    }
  }
  return await genetateDid();
};
