import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ConversationTopicRepository from '../../../conversationTopic/repository/index.js';
import ConversationReportRepository from '../../repository/index.js';
import type AddConversationReportDto from './dto.js';

export default async (dto: AddConversationReportDto): Promise<void> => {
  const { topic, userId } = dto;

  const conversationTopicRepo = new ConversationTopicRepository();
  const conversationReportRepo = new ConversationReportRepository();

  const conversationTopic = (await conversationTopicRepo.get({ _id: topic }))[0];

  appAssert(conversationTopic, EHttpCodes.CONFLICT, 'Conversation topic does not exist');

  await conversationReportRepo.add({
    description: dto.description,
    createdBy: userId,
    topic,
  });
};
