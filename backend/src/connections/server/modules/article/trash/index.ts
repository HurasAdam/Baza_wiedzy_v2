import { EHttpCodes } from '../../../../../enums/http.js';
import TrashArticleDto from '../../../../../modules/article/subModules/trash/dto.js';
import trashArticleController from '../../../../../modules/article/subModules/trash/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { ITrashArticleReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to trash article.
 */
const trashArticle = (): ((
  req: ITrashArticleReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new TrashArticleDto({ id: req.params.id, userId: req.userId });

    await trashArticleController(dto);

    res.status(EHttpCodes.OK).json({ message: 'Artykuł został usunięty' });
  });
};

export default trashArticle;
