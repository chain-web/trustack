import { bytes } from 'multiformats';
import { Address } from 'skchain';
import { z } from 'zod';
import { chain } from '../skchain.mjs';
import { publicProcedure, router } from './rpc.index.mjs';

export const chainRouter = router({
  getBalance: publicProcedure.input(z.string()).query(async ({ input }) => {
    const account = await chain.getAccount(input);
    return {
      balance: account?.getBlance().toString() || '0',
    };
  }),
  transaction: publicProcedure
    .input(
      z.object({
        amount: z.string(),
        recipient: z.string(),
        payload: z
          .object({
            method: z.string(),
            args: z.array(z.any()),
          })
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const tx = await chain.transaction({
        amount: BigInt(input.amount),
        recipient: new Address(input.recipient),
        payload: input.payload,
      });
      if (tx.trans) {
        const binary = (await tx.trans.toCborBlock()).bytes;
        const hex = bytes.toHex(binary);
        chain.message.info(hex);

        return {
          hex,
        };
      }
      return {
        hex: '',
      };
    }),
});

export type ChainRouter = typeof chainRouter;
