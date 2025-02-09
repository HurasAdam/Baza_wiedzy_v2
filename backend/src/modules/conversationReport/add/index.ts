import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import ConversationTopicModel from '../../conversationTopic/model.js';
import ConversationReportModel from '../model.js';
import type { ICreateConversationRaportTopicParams } from '../../../types/conversations.js';
import type { IConversationRaport } from '../model.js';

export default async ({ request, userId }: ICreateConversationRaportTopicParams): Promise<IConversationRaport> => {
  const { topic, description } = request;

  const conversationTopic = await ConversationTopicModel.exists({ topic });
  appAssert(!conversationTopic, EHttpCodes.CONFLICT, 'Conversation topic does not exist');

  return ConversationReportModel.create({
    description,
    createdBy: userId,
    topic,
  });
};
