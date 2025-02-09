import { getFavorite } from '../../../../modules/article/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId }: { userId: string } = req;

    const { totalFavouriteArticles, favouriteArticles, pageNumber, pageSize } = await getFavorite(
      req.query.page as string | undefined,
      userId,
    );

    res.status(200).json({
      data: favouriteArticles,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalFavouriteArticles / pageSize),
    });
  });
};
