import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ArticleModel from '../../../models/schema.js';

export default async ({ articleId }: { articleId: string }): Promise<{ status: EHttpCodes }> => {
  const article = await ArticleModel.findById(articleId);
  appAssert(article, EHttpCodes.CONFLICT, 'Article already exists');

  article.viewsCounter = article.viewsCounter + 1;
  await article.save();
  return { status: EHttpCodes.OK };
};
