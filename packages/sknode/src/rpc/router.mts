import { bytes } from 'multiformats';
import { Address } from 'skchain';
import { z } from 'zod';
import { processTrans } from '../chain/chain.utils.mjs';
import { chain } from '../chain/skchain.mjs';
import { publicProcedure, router } from './rpc.index.mjs';

export const chainRouter = router({
  ping: publicProcedure.query(async () => {
    return 'pong';
  }),

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
        cuLimit: z.string().optional(),
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
        cuLimit: input.cuLimit ? BigInt(input.cuLimit) : undefined,
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

  deployContract: publicProcedure.input(z.string()).query(async ({ input }) => {
    const tx = await chain.deploy({ payload: bytes.fromString(input) });
    return await processTrans(tx.trans);
  }),
  callContract: publicProcedure
    .input(
      z.object({
        amount: z.string(),
        contract: z.string(),
        cuLimit: z.string().optional(),
        method: z.string(),
        args: z.array(z.any()),
      }),
    )
    .query(async ({ input }) => {
      const res = await chain.callContract({
        amount: BigInt(input.amount),
        contract: new Address(input.contract),
        cuLimit: input.cuLimit ? BigInt(input.cuLimit) : undefined,
        method: input.method,
        args: input.args,
      });
      return {
        ...res,
        transaction: await processTrans(res.transaction),
      };
    }),

  getNetworkStatus: publicProcedure.query(async () => {
    const status = await chain.network.getNetWorkStatus();
    return {
      status,
    };
  }),
});

export type ChainRouter = typeof chainRouter;
