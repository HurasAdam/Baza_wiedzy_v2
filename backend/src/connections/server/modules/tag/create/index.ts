import { EHttpCodes } from '../../../../../enums/http.js';
import CreateTagDto from '../../../../../modules/tag/subModules/create/dto.js';
import createTagController from '../../../../../modules/tag/subModules/create/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { ICreateTagReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to create tag.
 */
const createTag = (): ((req: ICreateTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new CreateTagDto(req.body, req.userId);

    const newTag = await createTagController(dto);

    res.status(EHttpCodes.OK).json(newTag);
  });
};

export default createTag;
