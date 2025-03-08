import { EHttpCodes } from '../../../../../enums/http.js';
import GetUsersWithReportCountDto from '../../../../../modules/user/subModules/getWithReportCount/dto.js';
import get from '../../../../../modules/user/subModules/getWithReportCount/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IGetUsersWithReportCountReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IGetUsersWithReportCountReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetUsersWithReportCountDto(req.query);

    const data = await get(dto);

    res.status(EHttpCodes.OK).json(data);
  });
};
