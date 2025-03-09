import { EHttpCodes } from '../../../../../enums/http.js';
import GetUserWithArticleCountDto from '../../../../../modules/user/subModules/getWithArticleCount/dto.js';
import get from '../../../../../modules/user/subModules/getWithArticleCount/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IGetUsersWithArticleChangesReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get with article count.
 * @returns GetWithArticleCount.
 */
export default (): ((
  req: IGetUsersWithArticleChangesReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetUserWithArticleCountDto(req.query);

    const data = await get(dto);

    res.status(EHttpCodes.OK).json(data);
  });
};
