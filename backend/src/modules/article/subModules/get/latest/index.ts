import ArticleModel from '../../../models/schema.js';
import type GetLatestArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../../../types/article.js';

export default async (dto: GetLatestArticlesDto): Promise<IArticleEntity[]> => {
  return ArticleModel.find({}, { title: 1, createdAt: 1 })
    .populate([{ path: 'product', select: ['name', 'labelColor'] }])
    .sort({ createdAt: -1 })
    .limit(parseInt(dto.limit));
};
