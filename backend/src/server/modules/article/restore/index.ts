import { EHttpCodes } from '../../../../enums/http.js';
import restoreArticle from '../../../../modules/article/subModules/trash/restore/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { userId } = req;

    await restoreArticle(id as string, userId);

    return res.status(EHttpCodes.OK).json({ message: 'Artykuł został przywrócony z kosza' });
  });
};
