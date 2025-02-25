import { endOfMonth, startOfDay, startOfMonth, subDays } from 'date-fns';
import mongoose from 'mongoose';
import ConversationReportModel from '../../../model.js';
import type GetConversationReportDto from './dto.js';

export default async (dto: GetConversationReportDto): Promise<unknown[]> => {
  const { topicId, startDate, endDate, limit, range } = dto;

  let computedStartDate: Date | null = null;
  let computedEndDate: Date | null = null;

  if (range === 'today') {
    computedStartDate = startOfDay(new Date());
    computedEndDate = new Date();
  } else if (range === 'last7days') {
    computedStartDate = subDays(new Date(), 7);
    computedEndDate = new Date();
  } else if (range === 'last30days') {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    computedStartDate = startOfMonth(previousMonth);
    computedEndDate = endOfMonth(previousMonth);
  }

  const dateMatch: Record<string, unknown> = {};
  if (startDate || endDate || computedStartDate || computedEndDate) {
    const start = computedStartDate ?? (startDate ? new Date(startDate) : null);
    const end = computedEndDate ?? (endDate ? new Date(endDate) : null);

    dateMatch.createdAt = {
      ...(start && { $gte: start }),
      ...(end && { $lte: end }),
    };
  }

  const match = {
    ...(topicId && { topic: new mongoose.Types.ObjectId(String(topicId)) }),
    ...dateMatch,
  };

  return ConversationReportModel.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'conversationtopics',
        localField: 'topic',
        foreignField: '_id',
        as: 'topicDetails',
      },
    },
    {
      $unwind: '$topicDetails',
    },
    {
      $lookup: {
        from: 'products', // Kolekcja produktów
        localField: 'topicDetails.product', // Pole `product` w temacie rozmowy
        foreignField: '_id', // Powiązane pole `_id` w kolekcji produktów
        as: 'productDetails',
      },
    },
    {
      $unwind: {
        path: '$productDetails',
        preserveNullAndEmptyArrays: true, // Umożliwia brakujący produkt
      },
    },
    {
      $group: {
        _id: '$topic',
        topicTitle: { $first: '$topicDetails.title' },
        product: { $first: '$productDetails' }, // Szczegóły produktu
        reportCount: { $sum: 1 },
      },
    },
    {
      $project: {
        topicTitle: 1,
        product: {
          _id: 1,
          name: 1,
          labelColor: 1,
          banner: 1,
        },
        reportCount: 1,
      },
    },
    {
      $sort: {
        reportCount: -1,
      },
    },
    ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
  ]);
};
