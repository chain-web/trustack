import type { Libp2pOptions } from 'libp2p';
import { mplex } from '@libp2p/mplex';
import { noise } from '@chainsafe/libp2p-noise';
import { tcp } from '@libp2p/tcp';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import {
  circuitRelayServer,
  circuitRelayTransport,
} from 'libp2p/circuit-relay';
import { kadDHT } from '@libp2p/kad-dht';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';
import { webRTC } from '@libp2p/webrtc';
import { mdns } from '@libp2p/mdns';
import { identifyService } from 'libp2p/identify';
import { pingService } from 'libp2p/ping';
import { bootstrap } from '@libp2p/bootstrap';
import type { IServiceMap } from '../netwoek.js';
export const createConfig = (opts?: {
  tcpPort?: number;
  wsPort?: number;
  bootstrap?: string[];
}): Libp2pOptions<IServiceMap> => {
  return {
    addresses: {
      listen: [
        `/ip4/0.0.0.0/tcp/${opts?.tcpPort || 3636}`,
        `/ip4/0.0.0.0/tcp/${opts?.wsPort || 6667}/ws`,
      ],
    },
    streamMuxers: [mplex()],
    connectionEncryption: [noise()],
    transports: [
      tcp(),
      webSockets({
        filter: filters.all,
      }),
      webRTC({}),
      circuitRelayTransport(),
    ],
    services: {
      pubsub: gossipsub({ allowPublishToZeroPeers: true }),
      relay: circuitRelayServer(),
      dht: kadDHT({
        allowQueryWithZeroPeers: true,
        clientMode: false,
        protocolPrefix: '/sk/1.0',
      }),
      identify: identifyService(),
      ping: pingService(),
    },
    peerDiscovery: [
      mdns(),
      opts?.bootstrap?.length
        ? bootstrap({ list: opts.bootstrap, timeout: 1000 })
        : undefined,
    ].filter(Boolean),
  };
};
