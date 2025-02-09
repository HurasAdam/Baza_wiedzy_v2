import { EHttpCodes } from '../../../../../enums/http.js';
import { getArticleHistory } from '../../../../../modules/article/subModules/history/article/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;

    const articleHistory = await getArticleHistory(id as string);

    return res.status(EHttpCodes.OK).json(articleHistory);
  });
};
