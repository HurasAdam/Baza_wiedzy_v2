import { EHttpCodes } from '../../../enums/http.js';
import appAssert from '../../../utils/appAssert.js';
import ConversationTopicModel from '../../conversationTopic/model.js';
import ConversationReportModel from '../model.js';
import type AddConversationReportDto from './dto.js';
import type { IConversationRaport } from '../model.js';

export default async (dto: AddConversationReportDto): Promise<IConversationRaport> => {
  const { topic, userId } = dto;

  const conversationTopic = await ConversationTopicModel.exists({ topic });
  appAssert(!conversationTopic, EHttpCodes.CONFLICT, 'Conversation topic does not exist');

  return ConversationReportModel.create({
    description: dto.description,
    createdBy: userId,
    topic,
  });
};
