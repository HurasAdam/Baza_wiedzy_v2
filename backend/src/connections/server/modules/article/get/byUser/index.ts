import GetArticleByUserDto from '../../../../../../modules/article/subModules/get/byUser/dto.js';
import getByUser from '../../../../../../modules/article/subModules/get/byUser/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type { IGetArticleByUserReq } from './types.js';
import type express from 'express';

/**
 * Export controller, for endpoint to getting articles by user.
 */
const getArticleByUser = (): ((
  req: IGetArticleByUserReq,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetArticleByUserDto(req);
    const userArticles = await getByUser(dto);
    res.status(200).json(userArticles);
  });
};

export default getArticleByUser;
