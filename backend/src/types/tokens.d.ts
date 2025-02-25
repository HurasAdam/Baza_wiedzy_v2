import type { ISessionEntity } from '../modules/session/types.js';
import type { IUserEntity } from '../modules/user/types.js';
import type { SignOptions } from 'jsonwebtoken';

export interface IRefreshTokenPayload {
  sessionId: ISessionEntity['_id'];
}

export interface IAccessTokenPayload {
  userId: IUserEntity['_id'];
  sessionId: ISessionEntity['_id'];
}

export type ISignOptionsAndSecret = SignOptions & {
  secret: string;
};
