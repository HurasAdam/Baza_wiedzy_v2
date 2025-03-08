import { EHttpCodes } from '../../../../../../enums/http.js';
import getUsers from '../../../../../../modules/user/subModules/get/many/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetManyUsersReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetManyUsersReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (_req, res) => {
    const users = await getUsers();

    res.status(EHttpCodes.OK).json(users);
  });
};
