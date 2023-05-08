import { SKChain } from 'skchain';

const createChain = async () => {
  const chain = new SKChain({
    tcpPort: 6622,
    wsPort: 6723,
  });
  await chain.run();
  return chain;
};

createChain();
