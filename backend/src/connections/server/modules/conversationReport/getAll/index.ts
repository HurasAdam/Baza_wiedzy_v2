import { EHttpCodes } from '../../../../../enums/http.js';
import getAllReports from '../../../../../modules/conversationReport/getAll/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetAllConversationReportsReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IGetAllConversationReportsReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (_req, res) => {
    const data = await getAllReports();

    res.status(EHttpCodes.OK).json(data);
  });
};
