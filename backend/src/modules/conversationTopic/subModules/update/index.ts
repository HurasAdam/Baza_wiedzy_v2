import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ProductModel from '../../../product/model.js';
import ConversationTopicModel from '../../model.js';

export default async (id: string, title: string, product: string): Promise<void> => {
  const conversationTopic = await ConversationTopicModel.findById(id);
  appAssert(conversationTopic, EHttpCodes.NOT_FOUND, 'Conversation topic not found');

  if (product) {
    const assignedProduct = await ProductModel.findById(product);
    appAssert(assignedProduct, EHttpCodes.NOT_FOUND, 'Product not found');
  }

  if (title && product) {
    const existingTopic = await ConversationTopicModel.findOne({
      title,
      product,
      _id: { $ne: id },
    });

    appAssert(!existingTopic, EHttpCodes.CONFLICT, 'Tytuł tematu rozmowy już istnieje dla tego produktu');
  }

  conversationTopic.title = title ?? conversationTopic.title;
  conversationTopic.product = product ?? conversationTopic.product;

  await conversationTopic.save();
};
