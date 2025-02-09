import { EHttpCodes } from '../../../../enums/http.js';
import { getLatestArticles } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const limit = parseInt((req.query.limit as string) ?? '4');

    const latestArticles = await getLatestArticles(limit);

    return res.status(EHttpCodes.OK).json(latestArticles);
  });
};
