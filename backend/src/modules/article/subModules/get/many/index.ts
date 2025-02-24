import constructSearchQuery from '../../../../../utils/constructSearchQuery.js';
import UserModel from '../../../../user/model.js';
import ArticleModel from '../../../models/schema.js';
import type GetManyArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

export default async (
  dto: GetManyArticlesDto,
): Promise<{ data: IArticleEntity[]; pagination: { total: number; page: number; pages: number } }> => {
  const { userId } = dto;
  const query = {
    ...constructSearchQuery({ limit: dto.limit, page: dto.page, sortBy: dto.sortBy }),
    isTrashed: { $ne: true },
  };
  const user = await UserModel.findById(userId).select('favourites');
  const favouritesList = user?.favourites;

  const limit = parseInt(dto.limit ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt(dto.page ?? '1');
  const skip = (pageNumber - 1) * pageSize;
  const sortBy = dto.sortBy ?? '-createdAt';
  const articles = await ArticleModel.find(query)
    .select(['-clientDescription', '-employeeDescription', '-verifiedBy', '-updatedAt', '-__v'])
    .populate([
      { path: 'tags', select: ['name', 'shortname'] },
      { path: 'createdBy', select: ['name', 'surname'] },
      { path: 'product', select: ['name', 'labelColor', 'banner'] },
    ])
    .skip(skip)
    .limit(pageSize)
    .sort(sortBy);

  const total = await ArticleModel.countDocuments(query);
  const articlesWithFavourites = articles.map((article) => ({
    ...article.toObject(),
    isFavourite: favouritesList?.some((favId) => favId.equals(article._id)),
  }));

  return {
    data: articlesWithFavourites,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  };
};
