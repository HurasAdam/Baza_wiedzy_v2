import mongoose from 'mongoose';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleModel from '../../models/schema.js';
import { saveArticleChanges } from '../../repository/index.js';
import type UpdateArticleDto from './dto.js';

export default async (dto: UpdateArticleDto): Promise<void> => {
  const { id, userId, title, clientDescription, employeeDescription, tags, product } = dto;

  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const articleBeforeChanges = article.toObject();

  article.title = title ?? article.title;
  article.clientDescription = clientDescription ?? article.clientDescription;
  article.employeeDescription = employeeDescription ?? article.employeeDescription;
  article.tags = tags ? tags.map((t) => t).map((t) => new mongoose.Types.ObjectId(t)) : article.tags;
  article.product = product ? new mongoose.Types.ObjectId(product) : article.product;

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
