import { testRelayAccounts } from '@trustack/common';
import { SKChain } from 'skchain';

const createRelayServer = async () => {
  const user = testRelayAccounts[0];
  const chain = new SKChain({
    name: 'relay-server',
    tcpPort: user.tcpPort,
    wsPort: user.wsPort,
  });

  await chain.run({
    user,
    networkOnly: true,
  });

  // eslint-disable-next-line no-console
  console.log(
    'relay server start at: ',
    chain.network.network.node.getMultiaddrs(),
  );
};

createRelayServer();
