import { EHttpCodes } from '../../../../enums/http.js';
import { createConversationTopic } from '../../../../modules/conversationTopic/repository/index.js';
import { newConversationTopicSchema } from '../../../../modules/conversationTopic/schema.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const request = newConversationTopicSchema.parse(req.body);
    const { userId } = req;
    const newTag = await createConversationTopic({ request, userId });

    res.status(EHttpCodes.OK).json(newTag);
  });
};
