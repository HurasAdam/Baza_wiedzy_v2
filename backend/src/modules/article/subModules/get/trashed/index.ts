import constructSearchQuery from '../../../../../utils/constructSearchQuery.js';
import UserRepository from '../../../../user/repository/index.js';
import ArticleModel from '../../../models/schema.js';
import ArticleRepository from '../../../repository/article.js';
import type GetTrashedArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get trashed articles.
 * @param dto
 */
const getTrashedArticles = async (
  dto: GetTrashedArticlesDto,
): Promise<{ data: IArticleEntity[]; pagination: { total: number; page: number; pages: number } }> => {
  const { userId } = dto;

  const userRepo = new UserRepository();
  const articleRepo = new ArticleRepository();

  // #TODO Some elements are not defined properly, that come to query
  const query = {
    ...constructSearchQuery({ limit: dto.limit, page: dto.page, sortBy: dto.sortBy }),
    isTrashed: { $ne: false },
  };
  const user = await userRepo.getById(userId);

  const favouritesList = user?.favourites;

  const limit = parseInt(dto.limit ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt((dto.page as string) ?? '1');
  const skip = pageNumber - 1 * pageSize;
  const sortBy = dto.sortBy ?? '-createdAt';

  const articles = await ArticleModel.find(query)
    .select(['-clientDescription', '-employeeDescription', '-verifiedBy', '-updatedAt', '-viewsCounter', '-__v'])
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

export default getTrashedArticles;
