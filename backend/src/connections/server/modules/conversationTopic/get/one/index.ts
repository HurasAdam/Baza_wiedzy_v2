import { EHttpCodes } from '../../../../../../enums/http.js';
import GetOneConversationTopicDto from '../../../../../../modules/conversationTopic/subModules/get/one/dto.js';
import getConversationTopics from '../../../../../../modules/conversationTopic/subModules/get/one/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetOneConversationTopicReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IGetOneConversationTopicReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetOneConversationTopicDto({ topicId: req.params.id });

    const conversationTopic = await getConversationTopics(dto);

    res.status(EHttpCodes.OK).json(conversationTopic);
  });
};
