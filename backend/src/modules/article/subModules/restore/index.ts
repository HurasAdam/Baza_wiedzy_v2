import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleRepository from '../../repository/article.js';
import { saveArticleChanges } from '../../repository/index.js';
import type RestoreArticleDto from './dto.js';

export default async (dto: RestoreArticleDto): Promise<void> => {
  const { userId, id } = dto;

  const articleRepo = new ArticleRepository();

  const article = await articleRepo.getById(id);
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const updatedArticle = structuredClone(article);
  updatedArticle.isTrashed = false;

  await articleRepo.update(article._id as string, updatedArticle);

  await saveArticleChanges({
    articleId: id,
    articleBeforeChanges: article,
    updatedArticle,
    updatedBy: userId,
    eventType: EEventType.Restored,
  });
};
