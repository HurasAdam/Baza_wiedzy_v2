import Log from 'simpl-loggar';
import ConversationReportModel from '../../../model.js';
import ConversationReportRepository from '../../../repository/index.js';
import type GetUserConversationReportDto from './dto.js';
import type { IConversationRaportEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get conversation reports by user.
 * @param dto
 * @returns GetUserConversationReport.
 */
export default async (
  dto: GetUserConversationReportDto,
): Promise<{
  data: IConversationRaportEntity[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}> => {
  const { userId } = dto;
  Log.debug('Conversation controller', userId, dto.startDate, dto.endDate);

  const conversationReportRepo = new ConversationReportRepository();

  const dateFilter: { $gte?: Date; $lte?: Date } = {};
  if (dto.startDate) {
    dateFilter.$gte = new Date(dto.startDate);
  }
  if (dto.endDate) {
    dateFilter.$lte = new Date(dto.endDate);
  }

  const query = {
    createdBy: userId,
    topic: { $ne: null },
    ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
  };

  const total = await conversationReportRepo.count(query);

  const limit = parseInt(dto.limit ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt(dto.page ?? '1');
  const skip = (pageNumber - 1) * pageSize;

  const userReports = await ConversationReportModel.find(query)
    .populate({
      path: 'topic',
      select: 'title description product',
      populate: {
        path: 'product',
        select: ['name', 'labelColor'],
      },
    })
    .populate('createdBy', 'username email')
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  return {
    data: userReports,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  };
};
