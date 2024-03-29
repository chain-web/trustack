const modulePathIgnorePatterns = [
  '<rootDir>/packages/skchain/dist',
  '<rootDir>/packages/contract_builder/dist',
];

const transform = {
  '^.+\\.tsx?$': [
    'ts-jest',
    {
      tsconfig: 'tsconfig.json',
      useESM: true,
    },
  ],
};

/** @type {import('jest').Config} */
const config = {
  maxConcurrency: 1,
  maxWorkers: 1,
  automock: true,
  resetMocks: true,
  resetModules: true,
  testTimeout: 120000,
  projects: [
    {
      displayName: 'skchain',
      preset: 'ts-jest/presets/default-esm',
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform,
      testMatch: [
        '<rootDir>/packages/skchain/tests/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/packages/skchain/src/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/packages/contract/tests/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      modulePathIgnorePatterns,
    },
    {
      globalSetup: '<rootDir>/packages/sknode/tests/setup.mjs',
      globalTeardown: '<rootDir>/packages/sknode/tests/teardown.mjs',
      displayName: 'sknode',
      preset: 'ts-jest/presets/default-esm',
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform,
      testMatch: [
        '<rootDir>/packages/sknode/tests/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      modulePathIgnorePatterns,
    },
    {
      displayName: 'common',
      preset: 'ts-jest/presets/default-esm',
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform,
      testMatch: [
        '<rootDir>/packages/common/tests/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/packages/common/src/**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      modulePathIgnorePatterns,
    },
  ],
};

module.exports = config;
