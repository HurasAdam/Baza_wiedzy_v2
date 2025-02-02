import mongoose from 'mongoose';
import type { IVerificationCodeDocument } from '../types/documents.js';

const verificationCodeSchema = new mongoose.Schema<IVerificationCodeDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const verificationCodeModel = mongoose.model<IVerificationCodeDocument>(
  'VerificationCode',
  verificationCodeSchema,
  'verification_codes',
);
export default verificationCodeModel;
