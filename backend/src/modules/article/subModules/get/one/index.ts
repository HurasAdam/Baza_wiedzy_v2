import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserModel from '../../../../user/model.js';
import ArticleModel from '../../../models/schema.js';
import type GetOneArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../../../types/article.js';

export default async ({ userId, articleId }: GetOneArticlesDto): Promise<IArticleEntity> => {
  const user = await UserModel.findById(userId);
  const article = await ArticleModel.findById({ _id: articleId }).populate([
    { path: 'tags', select: ['name'] },
    { path: 'createdBy', select: ['name', 'surname'] },
    { path: 'verifiedBy', select: ['name', 'surname'] },
    { path: 'product', select: ['name', 'labelColor', 'banner'] },
  ]);

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');
  appAssert(user, EHttpCodes.CONFLICT, 'User not found');

  const isFavorite = user?.favourites.includes(article._id);

  const articleObj = {
    ...article.toObject(),
    isFavourite: isFavorite || false,
  };

  return articleObj;
};
