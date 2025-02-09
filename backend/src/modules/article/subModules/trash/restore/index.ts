import { EEventType } from '../../../../../enums/events.js';
import { EHttpCodes } from '../../../../../enums/http.js';
import { saveArticleChanges } from '../../../../../services/articleHistory.service.js';
import appAssert from '../../../../../utils/appAssert.js';
import ArticleModel from '../../../models/schema.js';

export default async (id: string, userId: string): Promise<void> => {
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
