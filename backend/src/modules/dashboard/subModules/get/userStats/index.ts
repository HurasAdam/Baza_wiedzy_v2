import { startOfDay, subDays } from 'date-fns';
import ArticleHistoryModel from '../../../../article/models/history.js';
import ArticleModel from '../../../../article/models/schema.js';
import ConversationReportModel from '../../../../conversationReport/model.js';
import type GetUserStatsDto from './dto.js';

export default async (
  dto: GetUserStatsDto,
): Promise<{ userArticles: number; userEditedArticles: number; userConversations: number }> => {
  const { userId, range } = dto;

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
  const userConversations = await ConversationReportModel.countDocuments({
    createdBy: userId,
    createdAt: { $gte: startDate, $lte: endDate }, // Filtrowanie po dacie
  });

  const userArticles = await ArticleModel.countDocuments({
    createdBy: userId,
    createdAt: { $gte: startDate, $lte: endDate }, // Filtrowanie po dacie
  });

  // Liczba edytowanych artykułów przez użytkownika
  const userEditedArticles = await ArticleHistoryModel.countDocuments({
    articleId: { $exists: true },
    updatedBy: userId,
    eventType: 'updated',
    updatedAt: { $gte: startDate, $lte: endDate },
  });

  return { userArticles, userEditedArticles, userConversations };
};
