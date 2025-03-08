import jwt from 'jsonwebtoken';
import { EAudience } from '../../src/enums/audience.js';
import { getConfig } from '../../src/tools/config.js';
import type { ISignOptionsAndSecret } from '../../src/types/index.js';
import type { SignOptions } from 'jsonwebtoken';

export const createCookie = (name: string, value: string): string => {
  const expires = new Date(Date.now() + 200 * 1000).toString();
  return `${name}=${value}; Path=/; HttpOnly; Expires=${expires}`;
};

export const createAccessToken = (userId?: string): string => {
  const accessTokenSignOptions: ISignOptionsAndSecret = {
    expiresIn: '15m',
    secret: getConfig().JWT_SECRET,
  };
  const defaults: SignOptions = {
    audience: [EAudience.User],
  };

  const payload = {
    sessionId: 'fakeSessionId',
    userId: userId ?? 'fakeUserId',
  };

  const { secret, ...signOpts } = accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

export const generateRandomName = (length: number = 12): string => {
  const vocabulary = 'ABCDEFGHIJKLMNOUPRSTUWZabcdefghijklmnouprstuwz';
  let name = '';
  for (let x = 0; x < length; x++) {
    name += vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  return name;
};
