import { $ } from 'execa';
export const createSubProcessNode = async (
  port: string,
): Promise<() => void> => {
  const kill = $({
    env: {
      RPC_PORT: port,
      TCP_PORT: port + 1,
      WS_PORT: port + 2,
    },
  })`node --experimental-wasm-modules ./packages/sknode/dist/index.mjs`.kill;

  return kill;
};
