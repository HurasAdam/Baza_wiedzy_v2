import type { ISessionDocument } from '../models/session.model.js';
import type { IUserDocument } from '../models/user.model.js';
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
