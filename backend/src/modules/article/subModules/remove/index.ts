import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleRepository from '../../repository/article.js';
import type RemoveArticleDto from './dto.js';

export default async (dto: RemoveArticleDto): Promise<void> => {
  const { id } = dto;

  const articleRepo = new ArticleRepository();

  const article = await articleRepo.getById(id);
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const deletedArticle = await articleRepo.remove(id);
  appAssert(deletedArticle, EHttpCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');

  await articleRepo.removeMany({ articleId: id });
};
