import GetUserConversationReportDto from '../../../../../modules/conversationReport/getUser/dto.js';
import getUserConversationReport from '../../../../../modules/conversationReport/getUser/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetUserConversationReportReq } from './types.js';
import type express from 'express';

export default (): ((
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
