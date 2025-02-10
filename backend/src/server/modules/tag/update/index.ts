import { newTagSchema } from '../../../../modules/tag/schema.js';
import { EHttpCodes } from '../../../../enums/http.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IUpdateTagReq } from './types.js';
import type express from 'express';
import { updateTag } from '../../../../modules/tag/repository/index.js';


export default (): ((req: IUpdateTagReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
const request = newTagSchema.parse(name);
    // Znajdź istniejący tag po ID
    const {message} = await updateTag({request,tagId:id})

    res.status(EHttpCodes.OK).json({ message});
  });
};
