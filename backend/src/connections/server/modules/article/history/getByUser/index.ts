import GetHistoryByUserDto from '../../../../../../modules/article/subModules/history/user/dto.js';
import getUserHistory from '../../../../../../modules/article/subModules/history/user/index.js';
import catchErrors from '../../../../../../utils/catchErrors.js';
import type { IGetHistoryByUserReq } from './types.js';
import type express from 'express';

export default (): ((
  req: IGetHistoryByUserReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetHistoryByUserDto(req);

    const userHistory = await getUserHistory(dto);

    // Zwracamy tylko rekordy, w których `articleId` nie jest nullem
    res.status(200).json(userHistory.filter((entry) => entry.articleId));
  });
};
