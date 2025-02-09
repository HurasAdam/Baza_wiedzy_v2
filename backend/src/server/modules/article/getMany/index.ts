import { EHttpCodes } from '../../../../enums/http.js';
import ArticleModel from '../../../../modules/article/schema.model.js';
import UserModel from '../../../../modules/user/model.js';
import catchErrors from '../../../../utils/catchErrors.js';
import constructSearchQuery from '../../../../utils/constructSearchQuery.js';
import type express from 'express';

/**
 * Get many articles.
 */
export default (): ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) => {
  return catchErrors(async (req, res) => {
    const { userId } = req;
    const query = {
      ...constructSearchQuery(req.query),
      isTrashed: { $ne: true },
    };
    const user = await UserModel.findById(userId).select('favourites');
    const favouritesList = user?.favourites;

    const limit = parseInt((req.query.limit as string) ?? '20');
    const pageSize = limit;
    const pageNumber = parseInt((req.query.page as string) ?? '1');
    const skip = (pageNumber - 1) * pageSize;
    const sortBy = (req.query.sortBy as string) ?? '-createdAt';
    const articles = await ArticleModel.find(query)
      .select(['-clientDescription', '-employeeDescription', '-verifiedBy', '-updatedAt', '-__v'])
      .populate([
        { path: 'tags', select: ['name', 'shortname'] },
        { path: 'createdBy', select: ['name', 'surname'] },
        { path: 'product', select: ['name', 'labelColor', 'banner'] },
      ])
      .skip(skip)
      .limit(pageSize)
      .sort(sortBy);

    const total = await ArticleModel.countDocuments(query);
    const articlesWithFavourites = articles.map((article) => ({
      ...article.toObject(),
      isFavourite: favouritesList?.some((favId) => favId.equals(article._id)),
    }));

    const responseObject = {
      data: articlesWithFavourites,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    return res.status(EHttpCodes.OK).json(responseObject);
  });
};
