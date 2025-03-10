import { EHttpCodes } from '../../../../../enums/http.js';
import UpdateConversationTopicDto from '../../../../../modules/conversationTopic/subModules/update/dto.js';
import updateConversation from '../../../../../modules/conversationTopic/subModules/update/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IUpdateConversationTopicReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to update conversation topic.
 */
const updateConversationTopic = (): ((
  req: IUpdateConversationTopicReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new UpdateConversationTopicDto(req.body, req.params.id);

    await updateConversation(dto);

    res.status(EHttpCodes.OK).json({ message: 'Temat rozmowy został zaktualizowany' });
  });
};

export default updateConversationTopic;
