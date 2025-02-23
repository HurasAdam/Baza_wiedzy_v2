import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductModel from '../../../product/model.js';
import ConversationTopicModel from '../../model.js';
import type UpdateConversationTopicDto from './dto.js';

export default async (dto: UpdateConversationTopicDto): Promise<void> => {
  const { id } = dto;

  const conversationTopic = await ConversationTopicModel.findById(id);
  appAssert(conversationTopic, EHttpCodes.NOT_FOUND, 'Conversation topic not found');

  if (dto.product) {
    const assignedProduct = await ProductModel.findById(dto.product);
    appAssert(assignedProduct, EHttpCodes.NOT_FOUND, 'Product not found');
  }

  if (dto.title && dto.product) {
    const existingTopic = await ConversationTopicModel.findOne({
      title: dto.title,
      product: dto.product,
      _id: { $ne: id },
    });

    appAssert(!existingTopic, EHttpCodes.CONFLICT, 'Tytuł tematu rozmowy już istnieje dla tego produktu');
  }

  conversationTopic.title = dto.title ?? conversationTopic.title;
  conversationTopic.product = dto.product ?? conversationTopic.product;

  await conversationTopic.save();
};
