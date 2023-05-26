import type { Libp2pOptions } from 'libp2p';
import { mplex } from '@libp2p/mplex';
import { noise } from '@chainsafe/libp2p-noise';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { kadDHT } from '@libp2p/kad-dht';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { webRTC } from '@libp2p/webrtc';
import { circuitRelayTransport } from 'libp2p/circuit-relay';
import { identifyService } from 'libp2p/identify';
import { pingService } from 'libp2p/ping';
import type { IServiceMap } from '../netwoek.js';

export const createConfig = (): Libp2pOptions<IServiceMap> => {
  return {
    streamMuxers: [mplex()],
    connectionEncryption: [noise()],
    transports: [
      webSockets({
        filter: filters.all,
      }),
      webRTC({}),
      circuitRelayTransport(),
    ],
    services: {
      pubsub: gossipsub({ allowPublishToZeroPeers: true }),
      dht: kadDHT({
        allowQueryWithZeroPeers: true,
      }),
      identify: identifyService(),
      ping: pingService(),
    },
  };
};
