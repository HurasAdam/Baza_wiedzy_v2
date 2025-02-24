import ConversationReportModel from '../../../model.js';
import type { IConversationRaport } from '../../../model.js';

export default async (): Promise<IConversationRaport[]> => {
  return ConversationReportModel.find({});
};
