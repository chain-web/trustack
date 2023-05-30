import { SKChain } from 'skchain';
import { getUser, rpcPort, tcpPort, wsPort } from './config.mjs';

const createChain = async () => {
  const chain = new SKChain({
    tcpPort,
    wsPort,
    name: rpcPort.toString(),
    bootstrap: [
      // default bootstrap is relay server
      '/ip4/127.0.0.1/tcp/6689/p2p/12D3KooWNGzeLjNkY2JCVbU9C8NnyKSpoqXVXiLsYUsZ5QxVSbaK',
      '/ip4/172.17.0.2/tcp/6689/p2p/12D3KooWNGzeLjNkY2JCVbU9C8NnyKSpoqXVXiLsYUsZ5QxVSbaK',
      '/ip4/127.0.0.1/tcp/6690/ws/p2p/12D3KooWNGzeLjNkY2JCVbU9C8NnyKSpoqXVXiLsYUsZ5QxVSbaK',
      '/ip4/172.17.0.2/tcp/6690/ws/p2p/12D3KooWNGzeLjNkY2JCVbU9C8NnyKSpoqXVXiLsYUsZ5QxVSbaK',
    ],
  });
  const user = await getUser();
  await chain.run({ user });
  return chain;
};

export const chain = await createChain();
