import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserModel from '../../../../user/model.js';
import ArticleModel from '../../../models/schema.js';
import type { IMarkFavDto } from './types.js';

export default async (dto: IMarkFavDto): Promise<boolean> => {
  const user = await UserModel.findById({ _id: dto.userId });
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

  const article = await ArticleModel.findById({ _id: dto.id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const isFavorite = user?.favourites.includes(article._id);

  if (isFavorite) {
    user.favourites = user?.favourites.filter((favoriteId) => favoriteId.toString() !== article._id.toString());
  } else {
    user.favourites.push(article._id);
  }

  await UserModel.findByIdAndUpdate(dto.userId, { favourites: user.favourites });

  return isFavorite;
};
