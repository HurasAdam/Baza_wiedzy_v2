import mongoose from 'mongoose';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import NotificationRepository from '../../../notification/repository/index.js';
import { ArticleEntity } from '../../entity.js';
import ArticleRepository from '../../repository/article.js';
import { saveArticleChanges } from '../../repository/index.js';
import type { ICreateArticleDto } from './types.js';
import type { ICreateArticle } from '../../types.js';

/**
 * Export controller, for endpoint to create article logic.
 * @param dto
 * @returns CreateArticleLogic.
 */
export default async (dto: ICreateArticleDto): Promise<ArticleEntity> => {
  const { title, employeeDescription, tags, clientDescription, product, userId } = dto;

  const repo = new ArticleRepository();
  const notificationRepo = new NotificationRepository();

  const article = await repo.get({ title });
  appAssert(!article || article.length === 0, EHttpCodes.CONFLICT, 'Article already exists');

  const newArticle: ICreateArticle = {
    title,
    employeeDescription,
    clientDescription,
    tags: tags.map((t) => new mongoose.Types.ObjectId(t)),
    product: new mongoose.Types.ObjectId(product),
    createdBy: new mongoose.Types.ObjectId(userId),
    verifiedBy: new mongoose.Types.ObjectId(userId),
  };

  const newId = await repo.add(newArticle);
  const createdArticle = await repo.getById(newId); // This can be ignored if we create entity, which will fill the default data

  await saveArticleChanges({
    articleId: newId,
    updatedBy: userId,
    articleBeforeChanges: null,
    updatedArticle: createdArticle!,
    eventType: EEventType.Created,
  });

  await notificationRepo.add({
    userId,
    type: 'info',
    message: 'Dodano nowy artykuł',
    articleTitle: newArticle.title,
    articleProduct: newArticle.product.toString(),
    link: `/articles/${newId}`,
  });

  return new ArticleEntity({ ...newArticle, _id: newId });
};
