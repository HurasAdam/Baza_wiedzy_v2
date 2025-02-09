import { EHttpCodes } from '../../../../enums/http.js';
import { updateArticle } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { title, clientDescription, employeeDescription, tags, product, userId } = req.body;

    await updateArticle(id as string, userId, title, clientDescription, employeeDescription, tags, product);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł został zaktualizowany' });
  });
};
