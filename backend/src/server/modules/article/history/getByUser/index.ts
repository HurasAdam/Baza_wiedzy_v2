import { getUserHistory } from '../../../../../modules/article/subModules/history/user/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id: userId } = req.params;
    const { startDate, endDate } = req.query;

    const userHistory = await getUserHistory(userId as string, startDate as string, endDate as string);

    // Zwracamy tylko rekordy, w których `articleId` nie jest nullem
    res.status(200).json(userHistory.filter((entry) => entry.articleId));
  });
};
