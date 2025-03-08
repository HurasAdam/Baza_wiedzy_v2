import { Schema, model } from 'mongoose';
import type { IConversation } from './types.js';

const conversationReportSchema = new Schema(
  {
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'ConversationTopic',
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ConversationReportModel = model<IConversation>('ConversationReport', conversationReportSchema);
export default ConversationReportModel;
