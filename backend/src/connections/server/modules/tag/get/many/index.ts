import GetManyTagsDto from '../../../../../../modules/tag/subModules/get/many/dto.js';
import get from '../../../../../../modules/tag/subModules/get/many/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetManyTagReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get many tags.
 */
const getManyTags = (): ((req: IGetManyTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetManyTagsDto(req.query);

    const { tags, totalCount } = await get(dto);

    res.status(200).json({
      tags,
      totalCount,
    });
  });
};

export default getManyTags;
