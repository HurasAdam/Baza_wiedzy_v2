import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import { saveArticleChanges } from '../../../../services/articleHistory.service.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../models/schema.js';
import type mongoose from 'mongoose';

export default async (
  id: string,
  userId: string,
  title: string,
  clientDescription: string,
  employeeDescription: string,
  tags: mongoose.Types.ObjectId[],
  product: mongoose.Types.ObjectId,
): Promise<void> => {
  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const articleBeforeChanges = article.toObject();

  article.title = title ?? article.title;
  article.clientDescription = clientDescription ?? article.clientDescription;
  article.employeeDescription = employeeDescription ?? article.employeeDescription;
  article.tags = tags ?? article.tags;
  article.product = product ?? article.product;

  const updatedArticle = await article.save();
  const updatedArticleObject = updatedArticle.toObject();

  await saveArticleChanges({
    articleId: id,
    updatedBy: userId,
    articleBeforeChanges,
    updatedArticle: updatedArticleObject,
    eventType: EEventType.Updated,
  });
};
