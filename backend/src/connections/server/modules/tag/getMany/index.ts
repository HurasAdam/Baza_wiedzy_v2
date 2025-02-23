import GetManyTagsDto from '../../../../../modules/tag/subModules/getMany/dto.js';
import get from '../../../../../modules/tag/subModules/getMany/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetManyTagReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetManyTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetManyTagsDto(req.query);

    const { tags, totalCount } = await get(dto);

    res.status(200).json({
      tags,
      totalCount,
    });
  });
};
