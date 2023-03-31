import { bytes } from 'multiformats';
import {
  createPeerIdFromDidJson,
  genetateDid,
  signById,
  verifyById,
} from '../did.js';

describe('peer id', () => {
  describe('test', () => {
    it('should gen did json ok', async () => {
      const didJson = await genetateDid();
      // console.log(didJson);
      expect(didJson.id).not.toEqual(undefined);
      expect(didJson.privKey).not.toEqual(undefined);
      expect(didJson.pubKey).not.toEqual(undefined);

      const peerId = await createPeerIdFromDidJson(didJson);
      expect(peerId.toString()).toEqual(didJson.id);
    });
    it('should sign verify ok', async () => {
      const didJson = await genetateDid();
      const msg = bytes.fromString('test');
      const msg2 = bytes.fromString('test2');
      const signed = await signById(didJson.privKey, msg);
      const verifyed = await verifyById(didJson.id, signed, msg);
      expect(verifyed).toEqual(true);
      const verifyed2 = await verifyById(didJson.id, signed, msg2);
      expect(verifyed2).toEqual(false);
    });
  });
});
