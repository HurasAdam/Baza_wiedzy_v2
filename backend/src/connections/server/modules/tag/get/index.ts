import { EHttpCodes } from '../../../../../enums/http.js';
import GetTagDto from '../../../../../modules/tag/subModules/get/dto.js';
import getTag from '../../../../../modules/tag/subModules/get/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetTagReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetTagDto({ tagId: req.params.id });

    const tag = await getTag(dto);

    res.status(EHttpCodes.OK).json(tag);
  });
};
