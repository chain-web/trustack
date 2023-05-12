import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { ChainRouter } from './router.mjs';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createRPCClient = (rpcPort: string | number) => {
  return createTRPCProxyClient<ChainRouter>({
    links: [
      httpBatchLink({
        url: `http://localhost:${rpcPort}`,
      }),
    ],
  });
};
