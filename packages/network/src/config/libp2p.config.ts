import type { Libp2pOptions } from 'libp2p';

export const createConfig = (): Libp2pOptions => {
  return {};
};

// /**
//  * peerId instance (it will be created if not provided)
//  */
// peerId: PeerId

// /**
//  * Addresses for transport listening and to advertise to the network
//  */
// addresses: AddressManagerInit

// /**
//  * libp2p Connection Manager configuration
//  */
// connectionManager: ConnectionManagerInit

// /**
//  * A connection gater can deny new connections based on user criteria
//  */
// connectionGater: Partial<ConnectionGater>

// /**
//  * libp2p transport manager configuration
//  */
// transportManager: TransportManagerInit

// /**
//  * An optional datastore to persist peer information, DHT records, etc.
//  *
//  * An in-memory datastore will be used if one is not provided.
//  */
// datastore: Datastore

// /**
//  * libp2p PeerStore configuration
//  */
// peerStore: PeerStoreInit

// /**
//  * libp2p Peer routing service configuration
//  */
// peerRouting: PeerRoutingInit

// /**
//  * keychain configuration
//  */
// keychain: KeyChainInit

// /**
//  * The NAT manager controls uPNP hole punching
//  */
// nat: NatManagerInit

// /**
//  * If configured as a relay this node will relay certain
//  * types of traffic for other peers
//  */
// relay: RelayConfig

// /**
//  * libp2p identify protocol options
//  */
// identify: IdentifyServiceInit

// /**
//  * libp2p ping protocol options
//  */
// ping: PingServiceInit

// /**
//  * libp2p fetch protocol options
//  */
// fetch: FetchServiceInit

// /**
//  * An array that must include at least 1 compliant transport
//  */
// transports: Array<(components: Components) => Transport>
// streamMuxers?: Array<(components: Components) => StreamMuxerFactory>
// connectionEncryption?: Array<(components: Components) => ConnectionEncrypter>
// peerDiscovery?: Array<(components: Components) => PeerDiscovery>
// peerRouters?: Array<(components: Components) => PeerRouting>
// contentRouters?: Array<(components: Components) => ContentRouting>

// /**
//  * Pass a DHT implementation to enable DHT operations
//  */
// dht?: (components: Components) => DualDHT

// /**
//  * A Metrics implementation can be supplied to collect metrics on this node
//  */
// metrics?: (components: Components) => Metrics

// /**
//  * If a PubSub implmentation is supplied, PubSub operations will become available
//  */
// pubsub?: (components: Components) => PubSub

// /**
//  * A ConnectionProtector can be used to create a secure overlay on top of the network using pre-shared keys
//  */
// connectionProtector?: (components: Components) => ConnectionProtector
