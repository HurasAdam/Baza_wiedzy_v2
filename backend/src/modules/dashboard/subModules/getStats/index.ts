import { startOfDay, subDays } from 'date-fns';
import ArticleHistoryModel from '../../../article/models/history.js';
import ArticleModel from '../../../article/models/schema.js';
import ConversationReportModel from '../../../conversationReport/model.js';
import type GetStatsDto from './dto.js';

export default async (
  dto: GetStatsDto,
): Promise<{ articleCount: number; conversationCount: number; editedArticlesCount: number }> => {
  const { range } = dto;
  let startDate;
  const endDate = new Date(); // Current date

  // Determine start date based on the range
  if (range === 'today') {
    startDate = startOfDay(new Date());
  } else if (range === 'last7days') {
    startDate = subDays(endDate, 7);
  } else if (range === 'last30days') {
    startDate = subDays(endDate, 30);
  } else {
    throw new Error('Invalid range parameter');
  }

  const articleCount = await ArticleModel.countDocuments({
    isTrashed: false,
    createdAt: { $gte: startDate, $lte: endDate }, // Added date filter
  });

  // Filter conversations based on the date range
  const conversationCount = await ConversationReportModel.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }, // Added date filter
  });

  const editedArticlesCount = await ArticleHistoryModel.countDocuments({
    eventType: 'updated',
    updatedAt: { $gte: startDate, $lte: endDate },
  });

  return { articleCount, editedArticlesCount, conversationCount };
};
