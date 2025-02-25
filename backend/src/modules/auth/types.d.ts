import type { EVerificationCodeType } from '../../enums/verification.ts';
import type mongoose from 'mongoose';

export interface ICreateAuth {
  userId: mongoose.Types.ObjectId;
  type: EVerificationCodeType;
  expiresAt: Date;
}

export interface IAuthEntity extends ICreateAuth {
  _id: mongoose.Types.ObjectId | string;
  createdAt: Date;
}

export interface IAuth extends ICreateAuth, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
