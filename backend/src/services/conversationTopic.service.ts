import { EHttpCodes } from '../enums/http.js';
import ConversationReportModel from '../models/conversationReport.model.js';
import ConversationTopicModel from '../models/conversationTopic.model.js';
import appAssert from '../utils/appAssert.js';
import type { IConversationTopic } from '../models/conversationTopic.model.js';
import type { ICreateConversationTopicParams, IGetConversationTopicParams } from '../types/conversations.js';

export const createConversationTopic = async ({
  request,
  userId,
}: ICreateConversationTopicParams): Promise<{ data: IConversationTopic; message: string }> => {
  const { title, product } = request;

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

export const getConversationTopic = async ({
  topicId,
}: IGetConversationTopicParams): Promise<IConversationTopic | null> => {
  const conversationTopic = await ConversationTopicModel.findById({ _id: topicId }).populate([
    { path: 'product', select: ['name'] },
  ]);
  return conversationTopic;
};

export const deleteConversationTopic = async ({ topicId }: { topicId: string }): Promise<{ message: string }> => {
  const conversationTopic = await ConversationTopicModel.findById({ _id: topicId });
  appAssert(conversationTopic, EHttpCodes.NOT_FOUND, 'Conversation topic not found');

  await ConversationTopicModel.findByIdAndDelete({ _id: topicId });

  await ConversationReportModel.updateMany({ topic: topicId }, { $set: { topic: null } });

  return { message: 'Conversataion topic deleted successfully' };
};
