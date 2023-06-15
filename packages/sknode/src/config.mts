/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DidJson } from '@trustack/common';

export const rpcPort = +(process.env.RPC_PORT || 3666);
export const wsPort = +(process.env.WS_PORT || 3667);
export const tcpPort = +(process.env.TCP_PORT || 3668);
export const getUser = async (): Promise<DidJson> => {
  return {
    id: process.env.DID_ID!,
    pubKey: process.env.DID_PK!,
    privKey: process.env.DID_SK!,
  };
};
