import { EHttpCodes } from '../../../../enums/http.js';
import trashArticle from '../../../../modules/article/subModules/trash/add/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { userId } = req;

    await trashArticle(id as string, userId);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł został usunięty' });
  });
};
