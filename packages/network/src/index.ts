import type { Libp2p } from 'libp2p';
import { createLibp2p } from 'libp2p';
import type { Datastore } from 'interface-datastore';
import { noise } from '@chainsafe/libp2p-noise';
import type { PeerId } from '@libp2p/interface-peer-id';
import { tcp } from '@libp2p/tcp';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { mplex } from '@libp2p/mplex';
// import { multiaddr } from '@multiformats/multiaddr';
// import first from 'it-first';
// import { pipe } from 'it-pipe';
// import { fromString, toString } from 'uint8arrays';
// import { webRTC } from 'js-libp2p-webrtc';

interface NetworkOptions {
  peerId: PeerId;
  datastore: Datastore;
  tcpPort: number;
}

class network {
  constructor(opts: NetworkOptions) {
    this.peerId = opts.peerId;
    this.datastore = opts.datastore;
    this.tcpPort = opts.tcpPort;
  }
  peerId: PeerId;
  datastore: Datastore;
  tcpPort: number;
  node!: Libp2p;

  async start() {
    this.node = await createLibp2p({
      peerId: this.peerId,
      datastore: this.datastore as any, // TODO: fix this by wait libp2p update it types
      addresses: {
        listen: [`/ip4/0.0.0.0/tcp/${this.tcpPort}`],
      },
      streamMuxers: [mplex()],
      connectionEncryption: [noise()],
      transports: [tcp()],
      pubsub: gossipsub(),
    });
  }
}

// const node = await createLibp2p({
//   transports: [webRTC()],
//   connectionEncryption: [() => new Noise()],
// });

// await node.start();

// const ma = multiaddr(
//   '/ip4/0.0.0.0/udp/56093/webrtc/certhash/uEiByaEfNSLBexWBNFZy_QB1vAKEj7JAXDizRs4_SnTflsQ',
// );
// const stream = await node.dialProtocol(ma, ['/my-protocol/1.0.0']);
// const message = `Hello js-libp2p-webrtc\n`;
// const response = await pipe(
//   [fromString(message)],
//   stream,
//   async (source) => await first(source),
// );
// const responseDecoded = toString(response.slice(0, response.length));
