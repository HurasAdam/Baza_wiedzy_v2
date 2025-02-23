import { EHttpCodes } from '../../../../../enums/http.js';
import AddConversationReportDto from '../../../../../modules/conversationReport/add/dto.js';
import add from '../../../../../modules/conversationReport/add/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IAddConversationReportReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IAddConversationReportReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new AddConversationReportDto(req.body, req.userId);

    const newTag = await add(dto);

    res.status(EHttpCodes.OK).json(newTag);
  });
};
