import Log from 'simpl-loggar';
import ArticleModel from '../..//models/schema.js';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import { saveArticleChanges } from '../../repository/index.js';
import type VerifyArticleDto from './dto.js';

export default async (dto: VerifyArticleDto): Promise<void> => {
  const { id, userId, isVerified } = dto;

  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');
  Log.debug('IsVerified', isVerified);
  const isVerifiedChanged = article.isVerified !== isVerified;
  article.isVerified = isVerified;
  const updatedAritlce = await article.save();
  const updatedAritlceObj = updatedAritlce.toObject();

  if (isVerifiedChanged) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: userId, // Id użytkownika, który dokonał zmiany
      eventType: isVerified ? EEventType.verified : EEventType.Unverified,
    });
  }
};
