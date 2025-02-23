import { EHttpCodes } from '../../../../enums/http.js';
import { createTag } from '../../../../modules/tag/repository/index.js';
import { newTagSchema } from '../../../../modules/tag/schema.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const request = newTagSchema.parse(req.body);
    const { userId } = req;
    const newTag = await createTag({ request, userId });

    res.status(EHttpCodes.OK).json(newTag);
  });
};
