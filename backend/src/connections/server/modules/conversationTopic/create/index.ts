import { EHttpCodes } from '../../../../../enums/http.js';
import CreateConversationTopicDto from '../../../../../modules/conversationTopic/subModules/create/dto.js';
import createConversationTopic from '../../../../../modules/conversationTopic/subModules/create/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { ICreateConversationTopicReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to create conversationReportTopic.
 */
const createConversationReportTopic = (): ((
  req: ICreateConversationTopicReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new CreateConversationTopicDto(req.body, req.userId);

    const newTag = await createConversationTopic(dto);

    res.status(EHttpCodes.OK).json(newTag);
  });
};

export default createConversationReportTopic;
