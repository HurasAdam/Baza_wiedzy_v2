import type mongoose from 'mongoose';

export interface ICreateConversationTopic {
  title: string;
  product: string | mongoose.Types.ObjectId;
  createdBy: string | mongoose.Types.ObjectId;
}

export interface IConversationTopicEntity extends ICreateConversationTopic {
  _id: string | mongoose.Types.ObjectId;
}

export interface IConversation extends IConversationTopicEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
