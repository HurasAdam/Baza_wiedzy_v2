import ArticleModel from '../../../models/schema.js';
import type GetLatestArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get latest articles.
 * @param dto
 */
const getLatestArticles = async (dto: GetLatestArticlesDto): Promise<IArticleEntity[]> => {
  return ArticleModel.find({}, { title: 1, createdAt: 1 })
    .populate([{ path: 'product', select: ['name', 'labelColor'] }])
    .sort({ createdAt: -1 })
    .limit(parseInt(dto.limit));
};

export default getLatestArticles;
