import { startOfDay, subDays } from 'date-fns';
import ArticleRepository from '../../../../article/repository/article.js';
import ConversationReportRepository from '../../../../conversationReport/repository/index.js';
import type GetStatsDto from './dto.js';

/**
 * Export controller, for endpoint to get dashboard stats.
 * @param dto
 * @returns GetDashboardStats.
 */
export default async (
  dto: GetStatsDto,
): Promise<{ articleCount: number; conversationCount: number; editedArticlesCount: number }> => {
  const { range } = dto;
  let startDate;
  const endDate = new Date(); // Current date

  const articleRepo = new ArticleRepository();
  const conversationReportRepo = new ConversationReportRepository();

  if (range === 'today') {
    startDate = startOfDay(new Date());
  } else if (range === 'last7days') {
    startDate = subDays(endDate, 7);
  } else if (range === 'last30days') {
    startDate = subDays(endDate, 30);
  } else {
    throw new Error('Invalid range parameter');
  }

  const articleCount = await articleRepo.count({
    isTrashed: false,
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const conversationCount = await conversationReportRepo.count({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const editedArticlesCount = await articleRepo.count({
    eventType: 'updated',
    updatedAt: { $gte: startDate, $lte: endDate },
  });

  return { articleCount, editedArticlesCount, conversationCount };
};
