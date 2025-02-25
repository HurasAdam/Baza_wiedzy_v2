import ConversationTopicModel from '../../../model.js';
import type GetConversationTopicDto from './dto.js';
import type { IConversationTopicEntity } from '../../../types.js';

export default async (dto: GetConversationTopicDto): Promise<IConversationTopicEntity | null> => {
  const { topicId } = dto;

  const conversationTopic = await ConversationTopicModel.findById({ _id: topicId }).populate([
    { path: 'product', select: ['name'] },
  ]);
  return conversationTopic;
};
