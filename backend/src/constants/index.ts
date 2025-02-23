import type { IConfig } from '../types/config.js';

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

const fakeConfig = {
  NODE_ENV: 'nodeEnv',
  MONGO_URI: 'mongoUri',
  PORT: '4000',
  JWT_SECRET: 'jwtSecret',
  APP_ORIGIN: 'appOrigin',
  JWT_REFRESH_SECRET: 'jwtRefreshSecret',
  SOCKET_PORT: '4001',
  EMAIL_SENDER: 'fakeSender',
};

export default (): IConfig => {
  if (process.env.NODE_ENV === 'test') return fakeConfig;

  return {
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    MONGO_URI: getEnv('MONGO_URI'),
    PORT: getEnv('PORT', '4004'),
    JWT_SECRET: getEnv('JWT_SECRET'),
    APP_ORIGIN: getEnv('APP_ORIGIN'),
    JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
    SOCKET_PORT: getEnv('SOCKET_PORT'),
    // export const RESEND_API_KEY = getEnv('RESEND_API_KEY');
    EMAIL_SENDER: getEnv('EMAIL_SENDER'),
  };
};
