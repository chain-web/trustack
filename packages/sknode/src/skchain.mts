import { SKChain } from 'skchain';
import { rpcPort, tcpPort, wsPort } from './config.mjs';

const createChain = async () => {
  const chain = new SKChain({
    tcpPort,
    wsPort,
    name: rpcPort.toString(),
  });

  await chain.run();
  return chain;
};

export const chain = await createChain();
