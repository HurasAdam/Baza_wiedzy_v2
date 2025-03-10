import ConversationTopicModel from '../../../model.js';
import type GetConversationTopicDto from './dto.js';
import type { IConversationTopicEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get one conversation topic.
 * @param dto
 */
const getOneConversationTopic = async (dto: GetConversationTopicDto): Promise<IConversationTopicEntity | null> => {
  const { topicId } = dto;

  const conversationTopic = await ConversationTopicModel.findById({ _id: topicId }).populate([
    { path: 'product', select: ['name'] },
  ]);
  return conversationTopic;
};

export default getOneConversationTopic;
