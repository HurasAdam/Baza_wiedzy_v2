import { Schema, model } from 'mongoose';
import type mongoose from 'mongoose';

export interface IConversationTopicEntity {
  _id: string | mongoose.Types.ObjectId;
  title: string;
  product: string | mongoose.Types.ObjectId;
  createdBy: string | mongoose.Types.ObjectId;
}

export interface IConversationTopic extends IConversationTopicEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

const conversationTopicSchema = new Schema({
  title: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const ConversationTopicModel = model<IConversationTopic>('ConversationTopic', conversationTopicSchema);
export default ConversationTopicModel;
