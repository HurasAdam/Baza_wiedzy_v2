import { EHttpCodes } from '../../../../enums/http.js';
import verifyArticle from '../../../../modules/article/subModules/verify/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IVerifyArticleReq } from './types.js';
import type express from 'express';

export default (): ((req: IVerifyArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    const { userId } = req;

    await verifyArticle(id, isVerified, userId);

    res.status(EHttpCodes.OK).json({
      message: `${isVerified ? 'Artykuł został zweryfikowany' : 'Artykuł został oznaczony jako do weryfikacji'}`,
    });
  });
};
