import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ConversationTopicRepository from '../../repository/index.js';
import type DeleteConversationTopicDto from './dto.js';

/**
 * Export controller, for endpoint to delete conversation topic.
 * @param dto
 * @returns DeleteConversationTopic.
 */
export default async (dto: DeleteConversationTopicDto): Promise<{ message: string }> => {
  const { topicId } = dto;

  const conversationTopicRepo = new ConversationTopicRepository();

  const conversationTopic = await conversationTopicRepo.getById(topicId);
  appAssert(conversationTopic, EHttpCodes.NOT_FOUND, 'Conversation topic not found');

  await conversationTopicRepo.remove(topicId);
  await conversationTopicRepo.updateMany({ topic: topicId }, { $set: { topic: null } });

  return { message: 'Conversataion topic deleted successfully' };
};
