import { SKChain } from 'skchain';
import { getUser, rpcPort, tcpPort, wsPort } from './config.mjs';

const createChain = async () => {
  const chain = new SKChain({
    tcpPort,
    wsPort,
    name: rpcPort.toString(),
  });
  const user = await getUser();
  await chain.run({ user });
  return chain;
};

export const chain = await createChain();
