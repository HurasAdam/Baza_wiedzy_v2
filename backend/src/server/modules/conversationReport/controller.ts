import { endOfMonth, startOfDay, startOfMonth, subDays } from 'date-fns';
import mongoose from 'mongoose';
import Log from 'simpl-loggar';
import { EHttpCodes } from '../../../enums/http.js';
import ConversationReportModel from '../../../modules/conversationReport/model.js';
import { newConversationReportSchema } from '../../../modules/conversationReport/schema.js';
import { addConversationReport } from '../../../services/conversationReport.service.js';
import catchErrors from '../../../utils/catchErrors.js';

export const addConversationReportHandler = catchErrors(async (req, res) => {
  const request = newConversationReportSchema.parse(req.body);
  const { userId } = req;
  const newTag = await addConversationReport({ request, userId });

  return res.status(EHttpCodes.OK).json(newTag);
});

export const getAllConversationReportsHandler = catchErrors(async (req, res) => {
  const { topicId, startDate, endDate, limit, range } = req.query;

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
    const start = computedStartDate ?? (startDate ? new Date(String(startDate)) : null);
    const end = computedEndDate ?? (endDate ? new Date(String(endDate)) : null);

    dateMatch.createdAt = {
      ...(start && { $gte: start }),
      ...(end && { $lte: end }),
    };
  }

  const match = {
    ...(topicId && { topic: new mongoose.Types.ObjectId(String(topicId as string)) }),
    ...dateMatch,
  };

  const allConversationReports = await ConversationReportModel.aggregate([
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
    ...(limit ? [{ $limit: parseInt(String(limit), 10) }] : []),
  ]);

  return res.status(200).json(allConversationReports);
});

export const getUserConversationReports = catchErrors(async (req, res) => {
  const { id: userId } = req.params;
  const { startDate, endDate } = req.query;

  Log.debug('Conversation controller', userId, startDate, endDate);

  const dateFilter: { $gte?: Date; $lte?: Date } = {};
  if (startDate) {
    dateFilter.$gte = new Date(startDate.toString());
  }
  if (endDate) {
    dateFilter.$lte = new Date(endDate.toString());
  }

  const userReports = await ConversationReportModel.find({
    createdBy: userId,
    topic: { $ne: null },
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
  })
    .populate({
      path: 'topic',
      select: 'title description product',
      populate: {
        path: 'product',
        select: ['name', 'labelColor'],
      },
    })
    .populate('createdBy', 'username email')
    .sort({ createdAt: -1 });

  return res.status(200).json(userReports);
});

export const getAllReports = catchErrors(async (_req, res) => {
  const allConversationReports = await ConversationReportModel.find({});
  return res.status(EHttpCodes.OK).json(allConversationReports);
});
