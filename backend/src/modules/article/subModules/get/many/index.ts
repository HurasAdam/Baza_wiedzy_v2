import constructSearchQuery from '../../../../../utils/constructSearchQuery.js';
import UserRepository from '../../../../user/repository/index.js';
import ArticleModel from '../../../models/schema.js';
import ArticleRepository from '../../../repository/article.js';
import type GetManyArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

export default async (
  dto: GetManyArticlesDto,
): Promise<{ data: IArticleEntity[]; pagination: { total: number; page: number; pages: number } }> => {
  const { userId, ...sortParams } = dto;

  const userRepo = new UserRepository();
  const articleRepo = new ArticleRepository();

  const query = {
    ...constructSearchQuery(sortParams),
    isTrashed: { $ne: true },
  };
  const user = await userRepo.getById(userId);
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

  const total = await articleRepo.count(query);
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
