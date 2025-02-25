import Log from 'simpl-loggar';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleRepository from '../../repository/article.js';
import { saveArticleChanges } from '../../repository/index.js';
import type VerifyArticleDto from './dto.js';

export default async (dto: VerifyArticleDto): Promise<void> => {
  const { id, userId, isVerified } = dto;

  const articleRepo = new ArticleRepository();

  const article = await articleRepo.getById(id);

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');

  Log.debug('IsVerified', isVerified);

  const isVerifiedChanged = article.isVerified !== isVerified;

  const updatedArticle = structuredClone(article);
  updatedArticle.isVerified = isVerified;

  await articleRepo.update(article._id as string, updatedArticle);

  if (isVerifiedChanged) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article,
      updatedArticle,
      updatedBy: userId,
      eventType: isVerified ? EEventType.verified : EEventType.Unverified,
    });
  }
};
