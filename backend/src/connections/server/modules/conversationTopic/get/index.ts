import { EHttpCodes } from '../../../../../enums/http.js';
import getConversationTopic from '../../../../../modules/conversationTopic/subModules/getMany/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetConversationReportReq } from '../../conversationReport/getAllReports/types.js';
import type express from 'express';

export default (): ((
  req: IGetConversationReportReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const data = await getConversationTopic(req.query);

    res.status(EHttpCodes.OK).json(data);
  });
};
