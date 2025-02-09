import { EHttpCodes } from '../../../../enums/http.js';
import getFavoriteArticles from '../../../../modules/article/subModules/favorite/get/index.js';
import {
  getByUser as getArticlesByUser,
  getOne as getOneArticle,
  getLatest as getLatestArticles,
  getMany as getManyArticles,
  getPopular as getPopularArticles,
  getTrashed as getTrashedArticles,
} from '../../../../modules/article/subModules/get/index.js';
import incrementArticleViews from '../../../../modules/article/subModules/views/increment/index.js';
import catchErrors from '../../../../utils/catchErrors.js';
import type express from 'express';

export const getOne = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId }: { userId: string } = req;
    const { id } = req.params;

    const article = await getOneArticle({ userId, articleId: id as string });
    await incrementArticleViews({ articleId: article?._id.toString() });
    return res.status(EHttpCodes.OK).json(article);
  });
};

export const getByUser = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { id: userId } = req.params;
    const { startDate, endDate } = req.query;

    const userArticles = await getArticlesByUser(userId as string, startDate as string, endDate as string);

    return res.status(200).json(userArticles);
  });
};

export const getFavorite = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId }: { userId: string } = req;

    const { totalFavouriteArticles, favouriteArticles, pageNumber, pageSize } = await getFavoriteArticles(
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

export const getLatest = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const limit = parseInt((req.query.limit as string) ?? '4');

    const latestArticles = await getLatestArticles(limit);

    return res.status(EHttpCodes.OK).json(latestArticles);
  });
};

/**
 * Get many articles.
 */
export const getMany = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId } = req;

    const responseObject = await getManyArticles(userId, req);

    return res.status(EHttpCodes.OK).json(responseObject);
  });
};

export const getPopular = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const limit = parseInt((req.query.limit as string) ?? '20');

    const popularArticles = await getPopularArticles(limit);

    return res.status(EHttpCodes.OK).json(popularArticles);
  });
};

export const getTrashed = (): ((
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId } = req;

    const responseObject = await getTrashedArticles(userId, req);

    return res.status(EHttpCodes.OK).json(responseObject);
  });
};
