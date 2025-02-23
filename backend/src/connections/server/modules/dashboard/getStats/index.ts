import GetStatsDto from '../../../../../modules/dashboard/subModules/getStats/dto.js';
import getStats from '../../../../../modules/dashboard/subModules/getStats/index.js';
import catchErrors from '../../../../../utils/catchErrors.js';
import type { IGetStatsReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetStatsReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetStatsDto(req.query);

    const { articleCount, conversationCount, editedArticlesCount } = await getStats(dto);

    res.status(200).json({
      addedArticles: articleCount,
      recordedConversations: conversationCount,
      editedArticles: editedArticlesCount,
    });
  });
};
