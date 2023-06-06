import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { rpcPort } from './config.mjs';
import { chainRouter } from './rpc/router.mjs';
import { chain } from './skchain.mjs';

const createRPCServer = async () => {
  const server = createHTTPServer({
    router: chainRouter,
  });

  const { port } = server.listen(rpcPort);
  if (port !== rpcPort) {
    throw new Error('rpc server listen failed');
  }
  // eslint-disable-next-line no-console
  chain.message.info(`-------rpc server start at ${rpcPort}`);
};

createRPCServer();
