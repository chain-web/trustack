// import * as nacl from 'tweetnacl';
// import { base58btc } from 'multiformats/bases/base58';
// import * as lsm from 'libsodium-wrappers-sumo';
// const { randomBytes, secretbox } = nacl;

// // https://libsodium.gitbook.io/doc/advanced/ed25519-curve25519
// // https://github.com/paulmillr/noble-ed25519#getsharedsecretprivatekey-publickey

// // const prefix_SKw3 = new Uint8Array([193, 149, 185, 110]);
// // const prefix_D7 = new Uint8Array([9, 60]);
// // const prefix_peerId = new Uint8Array([0, 36, 8, 1, 18, 32]);

// // 解析出nacl public key
// export const parseBoxPubKey = (did: string): Uint8Array => {
//   const byte = base58btc.decode(`z${did}`);
//   const pku8 = byte.slice(6);
//   const xpk = lsm.crypto_sign_ed25519_pk_to_curve25519(pku8);
//   return xpk;
// };

// // 从ed priv 解析出nacl priv key
// export const parseBoxPrivKey = (edPriv: Uint8Array): Uint8Array => {
//   const xsk = lsm.crypto_sign_ed25519_sk_to_curve25519(edPriv);
//   return xsk;
// };

// export const newNonce = (): Uint8Array => randomBytes(secretbox.nonceLength);
// (async () => {
//   // await lsm.ready;
//   // // 生成did
//   // const did = await genetateDid();
//   // const did2 = await genetateDid();
//   // const priv = privKeyToEdPriv(did.privKey);
//   // const priv2 = privKeyToEdPriv(did2.privKey);
//   // // 计算x25519 pk sk
//   // const xsk = parseBoxPrivKey(priv);
//   // const xsk2 = parseBoxPrivKey(priv2);
//   // const xpk = parseBoxPubKey(did.id);
//   // const xpk2 = parseBoxPubKey(did2.id);
//   // // 加密、解密
//   // const msg = 'test-msg'
//   // const nc = newNonce();
//   // const box = lsm.crypto_box_easy(msg, nc, xpk2, xsk);
//   // const unboxed = lsm.crypto_box_open_easy(box, nc, xpk, xsk2);
//   // console.log('encode-decode succ: ', bytes.toString(unboxed) === msg);
// })();

export default {};
