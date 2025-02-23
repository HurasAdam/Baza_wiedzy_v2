import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ConversationTopicModel from '../../model.js';
import type CreateConversationTopicDto from './dto.js';
import type { IConversationTopic } from '../../model.js';

export default async (dto: CreateConversationTopicDto): Promise<{ data: IConversationTopic; message: string }> => {
  const { title, product, userId } = dto;

  // Sprawdzanie, czy temat rozmowy z tym tytułem dla danego produktu już istnieje
  const conversationTopicExists = await ConversationTopicModel.exists({ title, product });
  appAssert(
    !conversationTopicExists,
    EHttpCodes.CONFLICT,
    'Conversation topic with this title already exists for the specified product',
  );

  // Tworzenie nowego tematu rozmowy
  const createdConversationTopic = await ConversationTopicModel.create({
    title,
    product,
    createdBy: userId,
  });

  return { data: createdConversationTopic, message: 'Conversation topic created successfully' };
};
