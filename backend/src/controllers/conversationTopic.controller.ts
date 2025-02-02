import { newConversationTopicSchema } from './conversationTopic.schema.js';
import { EHttpCodes } from '../enums/http.js';
import ConversationTopicModel from '../models/conversationTopic.model.js';
import ProductModel from '../models/product.model.js';
import {
  createConversationTopic,
  deleteConversationTopic,
  getConversationTopic,
} from '../services/conversationTopic.service.js';
import appAssert from '../utils/appAssert.js';
import catchErrors from '../utils/catchErrors.js';
import constructSearchQuery from '../utils/constructSearchQuery.js';

export const createConversationTopicHandler = catchErrors(async (req, res) => {
  const request = newConversationTopicSchema.parse(req.body);
  const { userId } = req;
  const newTag = await createConversationTopic({ request, userId });

  return res.status(EHttpCodes.OK).json(newTag);
});

export const getConversationTopicsHandler = catchErrors(async (req, res) => {
  const query = constructSearchQuery(req.query);
  const conversationTopics = await ConversationTopicModel.find(query)
    .populate([{ path: 'product', select: ['name', 'labelColor', 'banner', '-_id'] }])
    .sort('product.name');
  return res.status(EHttpCodes.OK).json(conversationTopics);
});

export const getSingleConversationTopicHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId }: { userId: string } = req;
  const conversationTopic = await getConversationTopic({
    userId,
    topicId: id as string,
  });
  return res.status(EHttpCodes.OK).json(conversationTopic);
});

export const deleteConversationTopicHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  const conversationTopic = await deleteConversationTopic({ topicId: id as string });
  return res.status(EHttpCodes.OK).json(conversationTopic);
});

export const updateConversationTopicleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { title, product } = req.body;

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

  conversationTopic.title = title || conversationTopic.title;
  conversationTopic.product = product || conversationTopic.product;

  await conversationTopic.save();

  res.status(EHttpCodes.OK).json({ message: 'Temat rozmowy został zaktualizowany' });
});
