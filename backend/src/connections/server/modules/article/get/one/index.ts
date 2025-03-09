import { EHttpCodes } from '../../../../../../enums/http.js';
import GetOneArticlesDto from '../../../../../../modules/article/subModules/get/one/dto.js';
import getOne from '../../../../../../modules/article/subModules/get/one/index.js';
import incrementArticleViews from '../../../../../../modules/article/subModules/views/increment/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetOneArticleReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to getting one articles.
 * @returns GetOneArticles.
 */
export default (): ((req: IGetOneArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const articleId = req?.params?.id;
    const dto = new GetOneArticlesDto({ articleId, userId: req.userId });

    const article = await getOne(dto);
    await incrementArticleViews({ articleId: article?._id.toString() });
    res.status(EHttpCodes.OK).json(article);
  });
};
