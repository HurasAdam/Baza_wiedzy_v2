import ConversationReportRepository from '../../../repository/index.js';
import type { IConversationRaportEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get all conversation reports.
 * @returns GetAllConversationReports.
 */
export default async (): Promise<IConversationRaportEntity[]> => {
  const repo = new ConversationReportRepository();

  return repo.get({});
};
