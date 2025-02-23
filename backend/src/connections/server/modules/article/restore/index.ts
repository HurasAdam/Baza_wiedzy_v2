import { EHttpCodes } from '../../../../../enums/http.js';
import RestoreArticleDto from '../../../../../modules/article/subModules/restore/dto.js';
import restoreArticle from '../../../../../modules/article/subModules/restore/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IRestoreArticleReq } from './types.js';
import type express from 'express';

export default (): ((req: IRestoreArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new RestoreArticleDto({ id: req.params.id, userId: req.userId });

    await restoreArticle(dto);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł został przywrócony z kosza' });
  });
};
