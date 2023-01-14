import { createLibp2p } from 'libp2p'
import { Noise } from '@chainsafe/libp2p-noise'
import { multiaddr } from '@multiformats/multiaddr'
import first from "it-first";
import { pipe } from "it-pipe";
import { fromString, toString } from "uint8arrays";
import { webRTC } from 'js-libp2p-webrtc'

const node = await createLibp2p({
  transports: [webRTC()],
  connectionEncryption: [() => new Noise()],
});

await node.start()

const ma =  multiaddr('/ip4/0.0.0.0/udp/56093/webrtc/certhash/uEiByaEfNSLBexWBNFZy_QB1vAKEj7JAXDizRs4_SnTflsQ')
const stream = await node.dialProtocol(ma, ['/my-protocol/1.0.0']) 
const message = `Hello js-libp2p-webrtc\n`
const response = await pipe([fromString(message)], stream, async (source) => await first(source))
const responseDecoded = toString(response.slice(0, response.length))