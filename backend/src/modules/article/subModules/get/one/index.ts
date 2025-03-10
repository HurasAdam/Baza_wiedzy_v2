import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import UserRepository from '../../../../user/repository/index.js';
import ArticleModel from '../../../models/schema.js';
import type GetOneArticlesDto from './dto.js';
import type { IArticleEntity } from '../../../types.js';

/**
 * Export controller, for endpoint to get one article.
 * @param dto
 */
const getOneArticle = async (dto: GetOneArticlesDto): Promise<IArticleEntity> => {
  const { userId, articleId } = dto;

  const userRepo = new UserRepository();

  const user = await userRepo.getById(userId);

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

export default getOneArticle;
