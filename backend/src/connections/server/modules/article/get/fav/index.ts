import GetFavArticlesDto from '../../../../../../modules/article/subModules/favorite/get/dto.js';
import getFavoriteArticles from '../../../../../../modules/article/subModules/favorite/get/index.js';
import catchErrors from '../../../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const dto = new GetFavArticlesDto({ userId: req.userId, page: req.query.page as string });

    const { totalFavouriteArticles, favouriteArticles, pageNumber, pageSize } = await getFavoriteArticles(dto);

    res.status(200).json({
      data: favouriteArticles,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalFavouriteArticles / pageSize),
    });
  });
};
