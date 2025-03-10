import GetUserConversationReportDto from '../../../../../../modules/conversationReport/subModules/get/user/dto.js';
import getUserConversationReport from '../../../../../../modules/conversationReport/subModules/get/user/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetUserConversationReportReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get user's conversation reports.
 */
const getUserConversationReports = (): ((
  req: IGetUserConversationReportReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetUserConversationReportDto(req.query, req.params.id);

    const responseObject = await getUserConversationReport(dto);

    res.status(200).json(responseObject);
  });
};

export default getUserConversationReports;
