import { EHttpCodes } from '../../../../../../enums/http.js';
import GetLatestArticlesDto from '../../../../../../modules/article/subModules/get/latest/dto.js';
import getLatest from '../../../../../../modules/article/subModules/get/latest/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetLatestArticleReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to getting latest articles.
 */
const getLatestArticles = (): ((
  req: IGetLatestArticleReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetLatestArticlesDto({ limit: req.query.limit ?? '4' });

    const latestArticles = await getLatest(dto);

    res.status(EHttpCodes.OK).json(latestArticles);
  });
};

export default getLatestArticles;
