import { EHttpCodes } from '../../../../../enums/http.js';
import RestoreArticleDto from '../../../../../modules/article/subModules/restore/dto.js';
import restoreArticleController from '../../../../../modules/article/subModules/restore/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IRestoreArticleReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to restoring removed article.
 */
const restoreArticle = (): ((
  req: IRestoreArticleReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RestoreArticleDto({ id: req.params.id, userId: req.userId });

    await restoreArticleController(dto);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł został przywrócony z kosza' });
  });
};

export default restoreArticle;
