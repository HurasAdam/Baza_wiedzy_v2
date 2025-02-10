import { deleteTag } from '../../../../modules/tag/repository/index.js';
import { EHttpCodes } from '../../../../enums/http.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {

   const {message} = await deleteTag({req})
   
    res.status(EHttpCodes.OK).json({ message});
  });
};
