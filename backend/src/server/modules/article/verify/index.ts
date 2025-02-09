import { EHttpCodes } from '../../../../enums/http.js';
import { verifyArticle } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { isVerified, userId } = req.body;

    await verifyArticle(id as string, isVerified, userId);

    res.status(EHttpCodes.OK).json({
      message: `${isVerified ? 'Artykuł został zweryfikowany' : 'Artykuł został oznaczony jako do weryfikacji'}`,
    });
  });
};
