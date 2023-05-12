import { SKChain } from 'skchain';
import { rpcPort } from './config.mjs';

const createChain = async () => {
  const chain = new SKChain({
    tcpPort: 6622,
    wsPort: 6723,
    name: rpcPort.toString(),
  });

  await chain.run();
  return chain;
};

export const chain = await createChain();
