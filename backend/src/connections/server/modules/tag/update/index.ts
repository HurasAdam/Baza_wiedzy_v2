import { EHttpCodes } from '../../../../../enums/http.js';
import UpdateTagDto from '../../../../../modules/tag/subModules/update/dto.js';
import update from '../../../../../modules/tag/subModules/update/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IUpdateTagReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to update tag.
 */
const updateTag = (): ((req: IUpdateTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new UpdateTagDto(req.body, req.params.id);

    const { message } = await update(dto);

    res.status(EHttpCodes.OK).json({ message });
  });
};

export default updateTag;
