import ConversationReportRepository from '../../../repository/index.js';
import type { IConversationRaportEntity } from '../../../types.js';

export default async (): Promise<IConversationRaportEntity[]> => {
  const repo = new ConversationReportRepository();

  return repo.get({});
};
