import { startOfDay, subDays } from 'date-fns';
import ArticleRepository from '../../../../article/repository/article.js';
import ConversationReportRepository from '../../../../conversationReport/repository/index.js';
import ArticleHistoryRepository from '../../../../notification/repository/index.js';
import type GetUserStatsDto from './dto.js';

/**
 * Export controller, for endpoint to get user dashboard stats.
 * @param dto
 * @returns GetUserDashboardStats.
 */
export default async (
  dto: GetUserStatsDto,
): Promise<{ userArticles: number; userEditedArticles: number; userConversations: number }> => {
  const { userId, range } = dto;

  const conversationReportRepo = new ConversationReportRepository();
  const articleRepo = new ArticleRepository();
  const articleHistoryRepo = new ArticleHistoryRepository();

  let startDate;
  const endDate = new Date(); // Aktualna data

  // Określenie startDate w zależności od zakresu (range)
  if (range === 'today') {
    startDate = startOfDay(new Date()); // Początek dzisiejszego dnia
  } else if (range === 'last7days') {
    startDate = subDays(endDate, 7); // Ostatnie 7 dni
  } else if (range === 'last30days') {
    startDate = subDays(endDate, 30); // Ostatnie 30 dni
  } else {
    throw new Error('Invalid range parameter');
  }

  // Statystyki dla użytkownika na podstawie daty
  const userConversations = await conversationReportRepo.count({
    createdBy: userId,
    createdAt: { $gte: startDate, $lte: endDate }, // Filtrowanie po dacie
  });

  const userArticles = await articleRepo.count({
    createdBy: userId,
    createdAt: { $gte: startDate, $lte: endDate }, // Filtrowanie po dacie
  });

  // Liczba edytowanych artykułów przez użytkownika
  const userEditedArticles = await articleHistoryRepo.count({
    articleId: { $exists: true },
    updatedBy: userId,
    eventType: 'updated',
    updatedAt: { $gte: startDate, $lte: endDate },
  });

  return { userArticles, userEditedArticles, userConversations };
};
