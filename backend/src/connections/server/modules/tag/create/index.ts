import { EHttpCodes } from '../../../../../enums/http.js';
import CreateTagDto from '../../../../../modules/tag/subModules/create/dto.js';
import createTag from '../../../../../modules/tag/subModules/create/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { ICreateTagReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to create tag.
 * @returns CreateTag.
 */
export default (): ((req: ICreateTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new CreateTagDto(req.body, req.userId);

    const newTag = await createTag(dto);

    res.status(EHttpCodes.OK).json(newTag);
  });
};
