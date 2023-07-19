import { SKChain } from 'skchain';

const createChain = () => {
  const chain = new SKChain();
  return chain;
};

export const chain = createChain();

export const chainState = chain.chainState;
