import { EHttpCodes } from '../../../../../../enums/http.js';
import get from '../../../../../../modules/product/subModules/get/many/index.js';
import catchErrors from '../../../../../../utils/catchErrors.js';
import type { IGetManyProductsReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetManyProductsReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (_req, res) => {
    const data = await get();

    res.status(EHttpCodes.OK).json(data);
  });
};
