import { Schema, model } from 'mongoose';
import type { IConversation } from './types.js';

const conversationTopicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const ConversationTopicModel = model<IConversation>('ConversationTopic', conversationTopicSchema);
export default ConversationTopicModel;
