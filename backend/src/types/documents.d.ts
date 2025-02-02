import type { EVerificationCodeType } from '../enums/verification.ts';
import type mongoose from 'mongoose';

export interface IVerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: EVerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}
