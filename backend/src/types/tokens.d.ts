import type { ISessionDocument } from '../modules/session/model.ts';
import type { IUser } from '../modules/user/model.ts';
import type { SignOptions } from 'jsonwebtoken';

export interface IRefreshTokenPayload {
  sessionId: ISessionDocument['_id'];
}

export interface IAccessTokenPayload {
  userId: IUser['_id'];
  sessionId: ISessionDocument['_id'];
}

export type ISignOptionsAndSecret = SignOptions & {
  secret: string;
};
