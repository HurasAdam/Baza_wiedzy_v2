import { EHttpCodes } from '../../../../enums/http.js';
import removeArticle from '../../../../modules/article/subModules/remove/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;

    await removeArticle(id as string);

    // Odpowiedź
    res.status(EHttpCodes.OK).json({ message: 'Artykuł i powiązana historia zostały usunięte.' });
  });
};
