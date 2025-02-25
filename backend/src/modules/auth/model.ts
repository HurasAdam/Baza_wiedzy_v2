import mongoose from 'mongoose';
import type { IAuth } from './types.js';

const authSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const AuthModel = mongoose.model<IAuth>('VerificationCode', authSchema, 'verification_codes');
export default AuthModel;
