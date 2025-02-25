import ArticleHistoryModel from '../../../models/history.js';
import type GetHistoryByUserDto from './dto.js';
import type { IArticleHistory } from '../../../types.js';

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
