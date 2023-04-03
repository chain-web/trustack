import type { Libp2pOptions } from 'libp2p';
import { mplex } from '@libp2p/mplex';
import { noise } from '@chainsafe/libp2p-noise';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { kadDHT } from '@libp2p/kad-dht';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { webRTC } from '@libp2p/webrtc';

export const createConfig = (): Libp2pOptions => {
  return {
    streamMuxers: [mplex()],
    connectionEncryption: [noise()],
    transports: [
      webSockets({
        filter: filters.all,
      }),
      webRTC({}),
    ],
    pubsub: gossipsub(),
    dht: kadDHT(),
  };
};
