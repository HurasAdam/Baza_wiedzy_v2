import { EHttpCodes } from '../../../../../../enums/http.js';
import getManyConversationTopicsController from '../../../../../../modules/conversationTopic/subModules/get/many/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetConversationReportReq } from '../../../conversationReport/get/allReports/types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get many conversation report topics.
 */
const getManyConversationTopics = (): ((
  req: IGetConversationReportReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const data = await getManyConversationTopicsController(req.query);

    res.status(EHttpCodes.OK).json(data);
  });
};

export default getManyConversationTopics;
