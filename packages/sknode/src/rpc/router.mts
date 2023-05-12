import { z } from 'zod';
import { chain } from '../skchain.mjs';
import { publicProcedure, router } from './rpc.index.mjs';

export const chainRouter = router({
  getBalance: publicProcedure.input(z.string()).query(async ({ input }) => {
    const account = await chain.getAccount(input);
    return {
      balance: account?.getBlance().toString(),
    };
  }),
});

export type ChainRouter = typeof chainRouter;
