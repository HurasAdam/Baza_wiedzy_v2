import { EHttpCodes } from '../../../../../../enums/http.js';
import GetUserDto from '../../../../../../modules/user/subModules/get/one/dto.js';
import getUser from '../../../../../../modules/user/subModules/get/one/index.js';
import { CleanUserEntity } from '../../../../../../modules/user/utils/entity.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetUserDto({ userId: req.userId });

    const user = await getUser(dto);

    res.status(EHttpCodes.OK).json(new CleanUserEntity(user));
  });
};
