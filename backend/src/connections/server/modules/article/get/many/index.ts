import { EHttpCodes } from '../../../../../../enums/http.js';
import GetManyArticlesDto from '../../../../../../modules/article/subModules/get/many/dto.js';
import getMany from '../../../../../../modules/article/subModules/get/many/index.js';
import catchErrors from '../../../../../../utils/catchErrors.js';
import type { IGetManyArticleReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetManyArticleReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetManyArticlesDto(req);

    const responseObject = await getMany(dto);

    res.status(EHttpCodes.OK).json(responseObject);
  });
};
