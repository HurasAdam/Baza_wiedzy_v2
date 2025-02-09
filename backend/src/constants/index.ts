import type { IConfig } from '../types/config.js';

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export default (): IConfig => {
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
