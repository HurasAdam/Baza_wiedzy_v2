import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import { getOneUserById } from '../../../../user/repository/index.js';
import ArticleModel from '../../../models/schema.js';
import { getFavoriteArticles } from '../../../repository/index.js';
import type GetFavArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

export default async (
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

  const user = await getOneUserById(dto.userId);
  appAssert(!user, EHttpCodes.NOT_FOUND, 'User not found');

  const { favourites } = user!;

  const favouriteArticles = await getFavoriteArticles(
    favourites.map((f) => f.toString()),
    skip,
    pageSize,
  );

  const totalFavouriteArticles = await ArticleModel.countDocuments({
    _id: { $in: favourites },
  });

  return {
    favouriteArticles,
    totalFavouriteArticles,
    pageNumber,
    pageSize,
  };
};
