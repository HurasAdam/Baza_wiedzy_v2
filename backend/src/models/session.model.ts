import mongoose from 'mongoose';
import { thirtyDaysFromNow } from '../utils/date.js';

export interface ISessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<ISessionDocument>({
  userId: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  userAgent: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, default: thirtyDaysFromNow },
});

const SessionModel = mongoose.model<ISessionDocument>('Session', sessionSchema);
export default SessionModel;
