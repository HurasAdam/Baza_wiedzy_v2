import GetConversationReportDto from '../../../../../../modules/conversationReport/subModules/get/one/dto.js';
import getConversationReportsController from '../../../../../../modules/conversationReport/subModules/get/one/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetConversationReportReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get conversation reports.
 */
const getConversationReports = (): ((
  req: IGetConversationReportReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetConversationReportDto(req.query);

    const allConversationReports = await getConversationReportsController(dto);

    res.status(200).json(allConversationReports);
  });
};

export default getConversationReports;
