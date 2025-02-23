import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../models/schema.js';
import { saveArticleChanges } from '../../repository/index.js';
import type RestoreArticleDto from './dto.js';

export default async (dto: RestoreArticleDto): Promise<void> => {
  const { userId, id } = dto;

  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  article.isTrashed = false;
  const restoredArticle = await article.save();

  const updatedAritlceObj = restoredArticle.toObject();

  if (!updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: userId, // Id użytkownika, który dokonał zmiany
      eventType: EEventType.Restored, // Typ zdarzenia: 'updated'
    });
  }
};
