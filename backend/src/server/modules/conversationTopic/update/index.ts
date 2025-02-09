import { EHttpCodes } from '../../../../enums/http.js';
import updateConversation from '../../../../modules/conversationTopic/subModules/update/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IUpdateConversationTopicReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IUpdateConversationTopicReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id } = req.params;
    const { title, product } = req.body;

    await updateConversation(id, title, product);

    res.status(EHttpCodes.OK).json({ message: 'Temat rozmowy został zaktualizowany' });
  });
};
