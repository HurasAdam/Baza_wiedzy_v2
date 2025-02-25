import type mongoose from 'mongoose';

export interface ICreateSession {
  userId: mongoose.Types.ObjectId | string;
  userAgent: string;
}

export interface ISessionEntity extends ICreateSession {
  _id: string | mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

export interface ISession extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
