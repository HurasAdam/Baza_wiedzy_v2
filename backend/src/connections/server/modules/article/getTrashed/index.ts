import { EHttpCodes } from '../../../../../enums/http.js';
import GetTrashedArticlesDto from '../../../../../modules/article/subModules/get/trashed/dto.js';
import getTrashed from '../../../../../modules/article/subModules/get/trashed/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IGetTrashedArticlesReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to getting trashed.
 */
const getTrashedArticles = (): ((
  req: IGetTrashedArticlesReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetTrashedArticlesDto(req);

    const responseObject = await getTrashed(dto);

    res.status(EHttpCodes.OK).json(responseObject);
  });
};

export default getTrashedArticles;
