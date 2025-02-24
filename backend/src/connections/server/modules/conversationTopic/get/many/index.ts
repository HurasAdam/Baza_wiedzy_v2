import { EHttpCodes } from '../../../../../../enums/http.js';
import getManyConversationTopics from '../../../../../../modules/conversationTopic/subModules/get/many/index.js';
import catchErrors from '../../../../../../utils/catchErrors.js';
import type { IGetConversationReportReq } from '../../../conversationReport/get/allReports/types.js';
import type express from 'express';

export default (): ((
  req: IGetConversationReportReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const data = await getManyConversationTopics(req.query);

    res.status(EHttpCodes.OK).json(data);
  });
};
