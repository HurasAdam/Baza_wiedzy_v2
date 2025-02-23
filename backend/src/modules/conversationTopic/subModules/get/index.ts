import ConversationTopicModel from '../../model.js';
import type GetConversationTopicDto from './dto.js';
import type { IConversationTopic } from '../../model.js';

export default async (dto: GetConversationTopicDto): Promise<IConversationTopic | null> => {
  const { topicId } = dto;

  const conversationTopic = await ConversationTopicModel.findById({ _id: topicId }).populate([
    { path: 'product', select: ['name'] },
  ]);
  return conversationTopic;
};
