/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'skchain',
      preset: 'ts-jest/presets/default-esm',
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            useESM: true,
          },
        ],
      },
      testMatch: [
        '<rootDir>/packages/skchain/tests/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/packages/skchain/**/__tests__/**/*.[jt]s?(x)',
      ],
    },
  ],
};

module.exports = config;
