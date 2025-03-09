import { EHttpCodes } from '../../../../../enums/http.js';
import VerifyArticleDto from '../../../../../modules/article/subModules/verify/dto.js';
import verifyArticle from '../../../../../modules/article/subModules/verify/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IVerifyArticleReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to verifying article.
 * @returns VerifyArticle.
 */
export default (): ((req: IVerifyArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new VerifyArticleDto({ id: req.params.id, isVerified: req.body.isVerified, userId: req.userId });

    await verifyArticle(dto);

    res.status(EHttpCodes.OK).json({
      message: `${dto.isVerified ? 'Artykuł został zweryfikowany' : 'Artykuł został oznaczony jako do weryfikacji'}`,
    });
  });
};
