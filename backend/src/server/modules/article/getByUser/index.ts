import { getArticlesByUser } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id: userId } = req.params;
    const { startDate, endDate } = req.query;

    const userArticles = await getArticlesByUser(userId as string, startDate as string, endDate as string);

    return res.status(200).json(userArticles);
  });
};
