import mongoose from 'mongoose';
import { thirtyDaysFromNow } from '../../enums/dates.js';
import type { ISession } from './types.js';

const sessionSchema = new mongoose.Schema({
  userId: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: thirtyDaysFromNow(),
  },
});

const SessionModel = mongoose.model<ISession>('Session', sessionSchema);
export default SessionModel;
