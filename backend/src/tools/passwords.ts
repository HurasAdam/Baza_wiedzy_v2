import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConfig } from './config.js';
import { EAudience } from '../enums/audience.js';
import type { IAccessTokenPayload, IRefreshTokenPayload, ISignOptionsAndSecret } from '../types/index.js';
import type { VerifyOptions, SignOptions } from 'jsonwebtoken';

export const hashValue = async (val: string, saltRounds?: number): Promise<string> => {
  return bcrypt.hash(val, saltRounds ?? 10);
};

export const compareValue = async (value: string, hashedValue: string): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue).catch(() => false);
};

const defaults: SignOptions = {
  audience: [EAudience.User],
};

const accessTokenSignOptions: ISignOptionsAndSecret = {
  expiresIn: '15m',
  secret: getConfig().JWT_SECRET,
};

export const refreshTokenSignOptions: ISignOptionsAndSecret = {
  expiresIn: '30d',
  secret: getConfig().JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: IAccessTokenPayload | IRefreshTokenPayload,
  options?: ISignOptionsAndSecret,
): string => {
  const { secret, ...signOpts } = options ?? accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

export const verifyToken = <TPayload extends object = IAccessTokenPayload>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  },
): { payload: TPayload } | { error: string } => {
  const { secret = getConfig().JWT_SECRET, ...verifyOpts } = options ?? {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;
    return {
      payload,
    };
  } catch (err) {
    return {
      error: (err as Error).message,
    };
  }
};
