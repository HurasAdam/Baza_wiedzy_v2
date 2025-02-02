import { EHttpCodes } from '../enums/http.js';
import ConversationReportModel from '../models/conversationReport.model.js';
import ConversationTopicModel from '../models/conversationTopic.model.js';
import appAssert from '../utils/appAssert.js';
import type { IConversationRaport } from '../models/conversationReport.model.js';
import type { ICreateConversationRaportTopicParams } from '../types/conversations.js';

// eslint-disable-next-line import/prefer-default-export
export const addConversationReport = async ({
  request,
  userId,
}: ICreateConversationRaportTopicParams): Promise<IConversationRaport> => {
  const { topic, description } = request;

  const conversationTopic = await ConversationTopicModel.exists({ topic });
  appAssert(!conversationTopic, EHttpCodes.CONFLICT, 'Conversation topic does not exist');

  const createdConversationTopic = await ConversationReportModel.create({
    description,
    createdBy: userId,
    topic,
  });
  return createdConversationTopic;
};
