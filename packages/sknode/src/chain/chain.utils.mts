import { bytes } from 'multiformats';
import type { Transaction } from 'skchain';

export const processTrans = async (
  trans: Transaction | undefined,
): Promise<{ hex: string }> => {
  if (trans) {
    const binary = (await trans.toCborBlock()).bytes;
    const hex = bytes.toHex(binary);

    return {
      hex,
    };
  }
  return {
    hex: '',
  };
};
