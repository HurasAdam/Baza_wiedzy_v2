import { EHttpCodes } from '../../../../../../enums/http.js';
import GetPopularArticles from '../../../../../../modules/article/subModules/get/popular/dto.js';
import getPopular from '../../../../../../modules/article/subModules/get/popular/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetPopularArticlesReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to getting popular articles.
 * @returns GetPopularArticles.
 */
export default (): ((
  req: IGetPopularArticlesReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetPopularArticles({ limit: parseInt((req.query.limit as string) ?? '20') });

    const popularArticles = await getPopular(dto);

    res.status(EHttpCodes.OK).json(popularArticles);
  });
};
