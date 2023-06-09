import {
  createEd25519PeerId,
  createFromPrivKey,
} from '@libp2p/peer-id-factory';
import { unmarshalPrivateKey, unmarshalPublicKey } from '@libp2p/crypto/keys';
import type { PeerId } from '@libp2p/interface-peer-id';

import { toString } from 'uint8arrays/to-string';
import { bytes } from 'multiformats';
import { base58btc } from 'multiformats/bases/base58';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import type { DidJson } from '../interface/did.mjs';

// 生成 libp2p de did
export const genetateDid = async (): Promise<DidJson> => {
  const did = await createEd25519PeerId();
  // message.info(did.toJSON(), did);
  const didJson: DidJson = {
    id: base58btc.encode(did.multihash.bytes).slice(1), // remove first z
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    privKey: toString(did.privateKey!, 'base64pad'),
    pubKey: toString(did.publicKey, 'base64pad'),
  };
  return didJson;
};

// 签名
// 使用ED25519，参考 libp2p-crypto/src/keys
export const signById = async (
  priv: string,
  data: Uint8Array,
): Promise<string> => {
  const PK = await unmarshalPrivateKey(uint8ArrayFromString(priv, 'base64pad'));
  const signature = new Uint8Array(await PK.sign(data));
  // message.info(signature);
  const signStr = bytes.toHex(signature);
  // message.info(bytes.fromHex(signStr));
  return signStr;
};

// 验证签名
export const verifyById = async (
  id: string,
  signature: string,
  data: Uint8Array,
): Promise<boolean> => {
  // message.info(signature);
  const PUK = unmarshalPublicKey(uint8ArrayFromString(`${id}`, 'base58btc'));
  const verifyed = await PUK.verify(data, bytes.fromHex(signature));
  return verifyed;
};

// export const createPeerIdFromDidString = async (
//   did: string,
// ): Promise<PeerId> => {
//   const PUK = unmarshalPublicKey(uint8ArrayFromString(`${did}`, 'base58btc'));
//   const peerId = await createFromPubKey(PUK);
//   return peerId;
// };

export const createPeerIdFromDidJson = async (
  didJson: DidJson,
): Promise<PeerId> => {
  const PK = await unmarshalPrivateKey(
    uint8ArrayFromString(didJson.privKey, 'base64pad'),
  );

  const peerId = await createFromPrivKey(PK);
  return peerId;
};

// 从libp2p私钥中解出ed priv
export const privKeyToEdPriv = (priv: string): Uint8Array => {
  const byte = uint8ArrayFromString(priv, 'base64pad');
  return byte.slice(4);
};

// const testDid = async () => {
//   // 验证一下did生成的每一位的随机性，确实是随机的
//   const dids = [];
//   for (let i = 0; i < 10000; i++) {
//     const did = await genetateDid();
//     dids.push(did.id);
//   }
//   const resMap = {
//     up: 0,
//     down: 0,
//   };
//   dids.forEach((ele) => {
//     const last = ele.substr(ele.length - 1, 1);
//     if (getCharCodeIsUp(last)) {
//       resMap.up = resMap.up + 1;
//     } else {
//       resMap.down = resMap.down + 1;
//     }
//   });
//   logger(resMap);
// };

// testDid();

// 1-9
// 'A' 'B' 'C' 'D' 'E' 'F' 'G' 'H'     'J' 'K' 'L' 'M' 'N'     'P' 'Q' 'R' 'S' 'T' 'U' 'V' 'W' 'X' 'Y' 'Z'

// 'a' 'b' 'c' 'd' 'e' 'f' 'g' 'h' 'i' 'j' 'k'     'm' 'n' 'o' 'p' 'q' 'r' 's' 't' 'u' 'v' 'w' 'x' 'y' 'z'
