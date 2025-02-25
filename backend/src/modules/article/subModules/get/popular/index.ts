import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ArticleModel from '../../../models/schema.js';
import type GetPopularArticles from './dto.js';
import type { IArticle } from '../../../types.js';

export default async (dto: GetPopularArticles): Promise<IArticle[]> => {
  const { limit } = dto;

  const popularArticles = await ArticleModel.find({ isTrashed: false })
    .sort({ viewsCounter: -1 })
    .limit(limit)
    .select('title product')
    .populate('product', 'name labelColor')
    .exec();

  appAssert(popularArticles.length > 0, EHttpCodes.NOT_FOUND, 'Nie znaleziono popularnych artykułów');
  return popularArticles;
};
