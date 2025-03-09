import GetUserStatsDto from '../../../../../modules/dashboard/subModules/get/userStats/dto.js';
import getUserStats from '../../../../../modules/dashboard/subModules/get/userStats/index.js';
import catchErrors from '../../../utils/catchErrors.js';
import type { IGetUserStatsReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to get user dashboard stats.
 * @returns GetUserDashboardStats.
 */
export default (): ((req: IGetUserStatsReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetUserStatsDto(req.query, req.userId);

    const { userConversations, userArticles, userEditedArticles } = await getUserStats(dto);

    res.status(200).json({
      userConversations,
      userArticles,
      userEditedArticles,
    });
  });
};
