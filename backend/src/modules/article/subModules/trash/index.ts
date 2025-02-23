import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../models/schema.js';
import { saveArticleChanges } from '../../repository/index.js';
import type TrashArticleDto from './dto.js';

export default async (dto: TrashArticleDto): Promise<void> => {
  const { id, userId } = dto;

  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  article.isTrashed = true;
  const trashedArticle = await article.save();

  const updatedAritlceObj = trashedArticle.toObject();

  if (updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article,
      updatedArticle: updatedAritlceObj,
      updatedBy: userId,
      eventType: EEventType.Trashed,
    });
  }
};
