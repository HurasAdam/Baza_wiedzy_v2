import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/index.js';
import { EAudience } from '../enums/audience.js';
import type { IAccessTokenPayload, IRefreshTokenPayload, ISignOptionsAndSecret } from '../types/index.js';
import type { VerifyOptions, SignOptions } from 'jsonwebtoken';

const defaults: SignOptions = {
  audience: [EAudience.User],
};

const accessTokenSignOptions: ISignOptionsAndSecret = {
  expiresIn: '15m',
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: ISignOptionsAndSecret = {
  expiresIn: '30d',
  secret: JWT_REFRESH_SECRET,
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
  const { secret = JWT_SECRET, ...verifyOpts } = options ?? {};
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
