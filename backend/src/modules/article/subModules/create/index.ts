import mongoose from 'mongoose';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import { createNewNotification } from '../../../notification/repository/index.js';
import { ArticleEntity } from '../../entity.js';
import { saveArticleChanges, getSchema, createNewSchema } from '../../repository/index.js';
import type { ICreateArticleDto } from './types.js';
import type { ICreateArticle } from '../../types.js';

export default async (dto: ICreateArticleDto): Promise<ArticleEntity> => {
  const { title, employeeDescription, tags, clientDescription, product, userId } = dto;

  const article = await getSchema({ title });
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

  const newId = await createNewSchema(newArticle);

  await saveArticleChanges({
    articleId: newId,
    updatedBy: userId,
    articleBeforeChanges: null,
    updatedArticle: newArticle,
    eventType: EEventType.Created,
  });

  await createNewNotification({
    userId,
    type: 'info',
    message: 'Dodano nowy artykuł',
    articleTitle: newArticle.title,
    articleProduct: newArticle.product.toString(),
    link: `/articles/${newId}`,
  });

  return new ArticleEntity({ ...newArticle, _id: newId });
};
