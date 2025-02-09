import { EHttpCodes } from '../../../../enums/http.js';
import { newConversationReportSchema } from '../../../../modules/conversationReport/schema.js';
import { addConversationReport } from '../../../../services/conversationReport.service.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const request = newConversationReportSchema.parse(req.body);
    const { userId } = req;
    const newTag = await addConversationReport({ request, userId });

    return res.status(EHttpCodes.OK).json(newTag);
  });
};
