import { EHttpCodes } from '../../../../../../enums/http.js';
import GetHistoryDto from '../../../../../../modules/article/subModules/history/article/dto.js';
import getArticleHistory from '../../../../../../modules/article/subModules/history/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetHistoryReq } from './types.js';
import type express from 'express';

export default (): ((req: IGetHistoryReq, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetHistoryDto(req);

    const articleHistory = await getArticleHistory(dto);

    res.status(EHttpCodes.OK).json(articleHistory);
  });
};
