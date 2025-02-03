import { Schema, model } from 'mongoose';
import type mongoose from 'mongoose';

export interface IConversationRaportEntity {
  _id: string | mongoose.Types.ObjectId;
  topic: string | mongoose.Types.ObjectId;
  description: string;
  createdBy: string | mongoose.Types.ObjectId;
}

export interface IConversationRaport extends IConversationRaportEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const conversationReportSchema = new Schema(
  {
    topic: { type: Schema.Types.ObjectId, ref: 'ConversationTopic', required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

const ConversationReportModel = model<IConversationRaport>('ConversationReport', conversationReportSchema);
export default ConversationReportModel;
