import { EHttpCodes } from '../../../../../enums/http.js';
import appAssert from '../../../../../utils/appAssert.js';
import ArticleRepository from '../../../repository/article.js';

export default async ({ articleId }: { articleId: string }): Promise<{ status: EHttpCodes }> => {
  const articleRepo = new ArticleRepository();

  const article = await articleRepo.getById(articleId);
  appAssert(article, EHttpCodes.CONFLICT, 'Article already exists');

  article.viewsCounter = article.viewsCounter + 1;
  await articleRepo.update(article._id as string, article);
  return { status: EHttpCodes.OK };
};
