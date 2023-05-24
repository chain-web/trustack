import { testRelayAccounts } from '@trustack/common';
import { SKChain } from 'skchain';

const createRelayServer = async () => {
  const chain = new SKChain({
    name: 'relay-server',
    tcpPort: 6689,
    wsPort: 6690,
  });

  await chain.run({
    user: testRelayAccounts[0],
    networkOnly: true,
  });
};

createRelayServer();
