import mongoose from 'mongoose';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import ArticleRepository from '../../repository/article.js';
import { saveArticleChanges } from '../../repository/index.js';
import type UpdateArticleDto from './dto.js';

/**
 * Export controller, for endpoint to update articles.
 * @param dto
 * @returns UpdateArticle.
 */
export default async (dto: UpdateArticleDto): Promise<void> => {
  const { id, userId, title, clientDescription, employeeDescription, tags, product } = dto;

  const articleRepo = new ArticleRepository();

  const article = await articleRepo.getById(id);

  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const updatedArticle = structuredClone({
    ...article,
    title: title ?? article.title,
    clientDescription: clientDescription ?? article.clientDescription,
    employeeDescription: employeeDescription ?? article.employeeDescription,
    tags: tags ? tags.map((t) => t).map((t) => new mongoose.Types.ObjectId(t)) : article.tags,
    product: product ? new mongoose.Types.ObjectId(product) : article.product,
  });

  await articleRepo.update(article._id as string, updatedArticle);

  await saveArticleChanges({
    articleId: id,
    updatedBy: userId,
    articleBeforeChanges: article,
    updatedArticle,
    eventType: EEventType.Updated,
  });
};
