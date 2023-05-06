import { SKChain } from 'skchain';

const createChain = async () => {
  const chain = new SKChain();
  await chain.run();
  return chain;
};

createChain();
