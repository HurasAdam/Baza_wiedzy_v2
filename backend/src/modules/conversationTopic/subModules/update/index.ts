import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductRepository from '../../../product/repository/index.js';
import ConversationTopicRepository from '../../repository/index.js';
import type UpdateConversationTopicDto from './dto.js';

/**
 * Export controller, for endpoint to update conversation topic.
 * @param dto
 * @returns UpdateConversationTopic.
 */
export default async (dto: UpdateConversationTopicDto): Promise<void> => {
  const { id } = dto;

  const conversationTopicRepo = new ConversationTopicRepository();
  const productRepo = new ProductRepository();

  const conversationTopic = await conversationTopicRepo.getById(id);
  appAssert(conversationTopic, EHttpCodes.NOT_FOUND, 'Conversation topic not found');

  if (dto.product) {
    const assignedProduct = await productRepo.getById(dto.product);
    appAssert(assignedProduct, EHttpCodes.NOT_FOUND, 'Product not found');
  }

  if (dto.title && dto.product) {
    const existingTopic = await conversationTopicRepo.get({
      title: dto.title,
      product: dto.product,
      _id: { $ne: id },
    });

    appAssert(!existingTopic, EHttpCodes.CONFLICT, 'Tytuł tematu rozmowy już istnieje dla tego produktu');
  }

  conversationTopic.title = dto.title ?? conversationTopic.title;
  conversationTopic.product = dto.product ?? conversationTopic.product;

  await conversationTopicRepo.update(conversationTopic._id as string, conversationTopic);
};
