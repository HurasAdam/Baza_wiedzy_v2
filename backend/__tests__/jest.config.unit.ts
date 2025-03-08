import defaultConfig from './jest.config.default';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  ...defaultConfig,
  roots: ['./__tests__/unit'],
};

export default config;
