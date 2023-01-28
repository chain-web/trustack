import type { GenesisConfig, networkidType } from './types.js';

export const networkid: networkidType = 'testnet';

export const genesis: GenesisConfig = {
  hash: '0000000000000000000000000000000000000000000000',
  parent: '0000000000000000000000000000000000000000000000',
  logsBloom: '0',
  difficulty: 10n,
  number: 0n,
  cuLimit: 1000n,
  timestamp: 1636461884881,
  alloc: {
    '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8': {
      balance: 10000000n,
    },
    '12D3KooWL1NF6fdTJ9cucEuwvuX8V8KtpJZZnUE4umdLBuK15eUZ': {
      balance: 10000000n,
    },
  },
};
