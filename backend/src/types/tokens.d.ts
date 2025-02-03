import type { ISessionDocument } from '../modules/session/model.ts';
import type { IUserDocument } from '../modules/user/model.ts';
import type { SignOptions } from 'jsonwebtoken';

export interface IRefreshTokenPayload {
  sessionId: ISessionDocument['_id'];
}

export interface IAccessTokenPayload {
  userId: IUserDocument['_id'];
  sessionId: ISessionDocument['_id'];
}

export type ISignOptionsAndSecret = SignOptions & {
  secret: string;
};
