import type { SecretKeyType } from 'bls-eth-wasm';
import * as bls from 'bls-eth-wasm';

let inited = false;

const importBlsVrf = async (): Promise<typeof bls> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { init, BLS12_381 } = (bls as any).default;
  if (inited) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (bls as any).default;
  }
  inited = true;
  await init(BLS12_381);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (bls as any).default;
};

export const genSecretKeyByData = async (
  data: Uint8Array,
): Promise<SecretKeyType> => {
  const { SecretKey } = await importBlsVrf();
  const sk = new SecretKey();
  sk.deserialize(data);
  return sk;
};

export const sign = async (
  seed: Uint8Array,
  secretKey: Uint8Array,
): Promise<Uint8Array> => {
  const sk = await genSecretKeyByData(secretKey);
  const sign = sk.sign(seed);
  return sign.serialize();
};

export const verify = async (
  seed: Uint8Array,
  publicKey: Uint8Array,
  signature: Uint8Array,
): Promise<boolean> => {
  const { PublicKey, Signature } = await importBlsVrf();
  const pk = new PublicKey();
  pk.deserialize(publicKey);
  const sign = new Signature();
  sign.deserialize(signature);
  const verify = pk.verify(sign, seed);
  return verify;
};

export const uint8ArrayToAvgNumber = (uint8Array: Uint8Array): number => {
  const sum = uint8Array.reduce((acc, cur) => acc + cur, 0);
  const avg = sum / uint8Array.length;
  return avg;
};

// export const sortProve = () => {};
