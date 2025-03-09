import ArticleHistoryModel from '../../../models/history.js';
import type GetHistoryByUserDto from './dto.js';
import type { IArticleHistory } from '../../../types.js';

/**
 * Export controller, for endpoint to get article history by user.
 * @param dto
 * @returns GetArticleHistoryByUser.
 */
export default async (dto: GetHistoryByUserDto): Promise<IArticleHistory[]> => {
  const filter: {
    updatedBy: string;
    updatedAt?: {
      $gte?: Date;
      $lte?: Date;
    };
    eventType: string;
    articleId?: { $ne: null };
  } = {
    updatedBy: dto.id,
    eventType: 'updated',
    articleId: { $ne: null },
  };

  if (dto.startDate || dto.endDate) {
    filter.updatedAt = {};
    if (dto.startDate) {
      filter.updatedAt.$gte = new Date(dto.startDate);
    }
    if (dto.endDate) {
      filter.updatedAt.$lte = new Date(dto.endDate);
    }
  }

  return ArticleHistoryModel.find(filter)
    .populate({
      path: 'articleId',
      select: ['title', 'isTrashed'],
      match: { isTrashed: false },
    })
    .populate({
      path: 'updatedBy',
      select: 'name surname',
    })
    .exec();
};
