import { EHttpCodes } from '../../../../../enums/http.js';
import DeleteConversationTopicDto from '../../../../../modules/conversationTopic/subModules/delete/dto.js';
import deleteConversationTopic from '../../../../../modules/conversationTopic/subModules/delete/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IDeleteConversationTopicReq } from './types.d.ts';
import type express from 'express';

/**
 * Export controller, for endpoint to delete conversation report topic.
 * @returns DeleteConversationReportTopic.
 */
export default (): ((
  req: IDeleteConversationTopicReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new DeleteConversationTopicDto({ topicId: req.params.id });

    const conversationTopic = await deleteConversationTopic(dto);

    res.status(EHttpCodes.OK).json(conversationTopic);
  });
};
