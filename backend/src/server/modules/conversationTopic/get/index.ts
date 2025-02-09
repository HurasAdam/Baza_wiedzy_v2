import { EHttpCodes } from '../../../../enums/http.js';
import ConversationTopicModel from '../../../../modules/conversationTopic/model.js';
import { getConversationTopic } from '../../../../services/conversationTopic.service.js';
import catchErrors from '../../../../utils/catchErrors.js';
import constructSearchQuery from '../../../../utils/constructSearchQuery.js';
import type express from 'express';

export const getConversationTopics = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const query = constructSearchQuery(req.query);
    const conversationTopics = await ConversationTopicModel.find(query)
      .populate([{ path: 'product', select: ['name', 'labelColor', 'banner', '-_id'] }])
      .sort('product.name');
    return res.status(EHttpCodes.OK).json(conversationTopics);
  });
};

export const getSingleConversationTopic = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { userId }: { userId: string } = req;
    const conversationTopic = await getConversationTopic({
      userId,
      topicId: id as string,
    });
    return res.status(EHttpCodes.OK).json(conversationTopic);
  });
};
