import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserRepository from '../../../../user/repository/index.js';
import ArticleRepository from '../../../repository/article.js';
import { getFavoriteArticles as getFavoriteArticlesRepo } from '../../../repository/index.js';
import type GetFavArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get favorite articles.
 * @param dto
 */
const getFavoriteArticles = async (
  dto: GetFavArticlesDto,
): Promise<{
  favouriteArticles: IArticleEntity[];
  totalFavouriteArticles: number;
  pageNumber: number;
  pageSize: number;
}> => {
  const pageSize = 15;
  const pageNumber = parseInt(dto.page ?? '1');
  const skip = (pageNumber - 1) * pageSize;

  const repo = new ArticleRepository();
  const userRepo = new UserRepository();

  const user = await userRepo.getById(dto.userId);
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

  const { favourites } = user;

  const favouriteArticles = await getFavoriteArticlesRepo(
    favourites.map((f) => f.toString()),
    skip,
    pageSize,
  );

  const totalFavouriteArticles = await repo.count({
    _id: { $in: favourites },
  });

  return {
    favouriteArticles,
    totalFavouriteArticles,
    pageNumber,
    pageSize,
  };
};

export default getFavoriteArticles;
