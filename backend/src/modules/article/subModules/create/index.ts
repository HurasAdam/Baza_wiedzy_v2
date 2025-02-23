import Log from 'simpl-loggar';
import { EEventType } from '../../../../enums/events.js';
import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import NotificationModel from '../../../notification/model.js';
import ArticleModel from '../../models/schema.js';
import { saveArticleChanges } from '../../repository/index.js';
import type { ICreateArticleDto } from './types.js';
import type { IArticle } from '../../../../types/article.js';

export default async (dto: ICreateArticleDto): Promise<IArticle> => {
  const { title, employeeDescription, tags, clientDescription, product, userId } = dto;

  const article = await ArticleModel.exists({ title });
  appAssert(!article, EHttpCodes.CONFLICT, 'Article already exists');

  const newArticle = await ArticleModel.create({
    title,
    employeeDescription,
    clientDescription,
    tags,
    product,
    createdBy: userId,
    verifiedBy: userId,
  });

  Log.debug('Article controller', newArticle, 'newArticle');

  await saveArticleChanges({
    articleId: newArticle?._id.toString(),
    updatedBy: userId,
    articleBeforeChanges: null,
    updatedArticle: newArticle,
    eventType: EEventType.Created,
  });

  const notification = await NotificationModel.create({
    userId,
    type: 'info',
    message: 'Dodano nowy artykuł',
    articleTitle: newArticle.title,
    articleProduct: newArticle.product,
    link: `/articles/${newArticle._id.toString()}`,
  });

  Log.debug('Created notification', notification);
  await notification.save();

  return newArticle;
};
