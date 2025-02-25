import type mongoose from 'mongoose';

export interface ICreateConversationReport {
  topic: string | mongoose.Types.ObjectId;
  description: string;
  createdBy: string | mongoose.Types.ObjectId;
}

export interface IConversationRaportEntity extends ICreateConversationReport {
  _id: string | mongoose.Types.ObjectId;
}

export interface IConversation extends IConversationRaportEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
