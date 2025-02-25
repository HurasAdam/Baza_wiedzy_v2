import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserRepository from '../../../../user/repository/index.js';
import ArticleRepository from '../../../repository/article.js';
import type { IMarkFavDto } from './types.js';
import type mongoose from 'mongoose';

export default async (dto: IMarkFavDto): Promise<boolean> => {
  const userRepo = new UserRepository();
  const articleRepo = new ArticleRepository();

  const user = await userRepo.getById(dto.userId);
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

  const article = await articleRepo.getById(dto.id);
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const isFavorite = user?.favourites.includes(article._id as mongoose.Types.ObjectId);

  if (isFavorite) {
    user.favourites = user?.favourites.filter((favoriteId) => favoriteId.toString() !== article._id.toString());
  } else {
    user.favourites.push(article._id as mongoose.Types.ObjectId);
  }

  await userRepo.update(dto.userId, { favourites: user.favourites });

  return isFavorite;
};
