import { EHttpCodes } from '../../../../../enums/http.js';
import GetUserWithChangeCountDto from '../../../../../modules/user/subModules/getWithChangeCount/dto.js';
import get from '../../../../../modules/user/subModules/getWithChangeCount/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IGetWithChangesCountReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get with change count.
 */
const getWithChangeCount = (): ((
  req: IGetWithChangesCountReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetUserWithChangeCountDto(req.query);

    const data = await get(dto);

    res.status(EHttpCodes.OK).json(data);
  });
};

export default getWithChangeCount;
