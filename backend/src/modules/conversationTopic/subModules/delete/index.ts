import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ConversationReportModel from '../../../conversationReport/model.js';
import ConversationTopicModel from '../../model.js';
import type DeleteConversationTopicDto from './dto.js';

export default async (dto: DeleteConversationTopicDto): Promise<{ message: string }> => {
  const { topicId } = dto;

  const conversationTopic = await ConversationTopicModel.findById({ _id: topicId });
  appAssert(conversationTopic, EHttpCodes.NOT_FOUND, 'Conversation topic not found');

  await ConversationTopicModel.findByIdAndDelete({ _id: topicId });

  await ConversationReportModel.updateMany({ topic: topicId }, { $set: { topic: null } });

  return { message: 'Conversataion topic deleted successfully' };
};
