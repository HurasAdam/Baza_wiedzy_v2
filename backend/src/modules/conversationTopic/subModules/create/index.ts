import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ConversationTopicRepository from '../../repository/index.js';
import type CreateConversationTopicDto from './dto.js';
import type { IConversationTopicEntity } from '../../types.js';

/**
 * Export controller, for endpoint to create conversation topic.
 * @param dto
 * @returns CreateConversationTopic.
 */
export default async (
  dto: CreateConversationTopicDto,
): Promise<{ data: IConversationTopicEntity; message: string }> => {
  const { title, product, userId } = dto;

  const conversationTopicRepo = new ConversationTopicRepository();

  // Sprawdzanie, czy temat rozmowy z tym tytułem dla danego produktu już istnIConversationRaportEntitye
  const conversationTopicExists = await conversationTopicRepo.get({ title, product });
  appAssert(
    !conversationTopicExists,
    EHttpCodes.CONFLICT,
    'Conversation topic with this title already exists for the specified product',
  );

  // Tworzenie nowego tematu rozmowy
  const topicId = await conversationTopicRepo.add({
    title,
    product,
    createdBy: userId,
  });
  const newTopic = await conversationTopicRepo.getById(topicId);

  return { data: newTopic!, message: 'Conversation topic created successfully' };
};
