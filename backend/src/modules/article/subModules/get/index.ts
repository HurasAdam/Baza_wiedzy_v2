import { EHttpCodes } from '../../../../enums/http.js';
import appAssert from '../../../../utils/appAssert.js';
import constructSearchQuery from '../../../../utils/constructSearchQuery.js';
import UserModel from '../../../user/model.js';
import ArticleModel from '../../models/schema.js';
import type { IGetArticleParams } from './types.js';
import type { IArticle, IArticleEntity } from '../../../../types/article.js';
import type express from 'express';

export const getOne = async ({ userId, articleId }: IGetArticleParams): Promise<IArticleEntity> => {
  const user = await UserModel.findById(userId);
  const article = await ArticleModel.findById({ _id: articleId }).populate([
    { path: 'tags', select: ['name'] },
    { path: 'createdBy', select: ['name', 'surname'] },
    { path: 'verifiedBy', select: ['name', 'surname'] },
    { path: 'product', select: ['name', 'labelColor', 'banner'] },
  ]);

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');
  appAssert(user, EHttpCodes.CONFLICT, 'User not found');

  const isFavorite = user?.favourites.includes(article._id);

  const articleObj = {
    ...article.toObject(),
    isFavourite: isFavorite || false,
  };

  return articleObj;
};

export const getLatest = async (limit: number): Promise<IArticle[]> => {
  return ArticleModel.find({}, { title: 1, createdAt: 1 })
    .populate([{ path: 'product', select: ['name', 'labelColor'] }])
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getPopular = async (limit: number): Promise<IArticle[]> => {
  const popularArticles = await ArticleModel.find({ isTrashed: false })
    .sort({ viewsCounter: -1 })
    .limit(limit)
    .select('title product')
    .populate('product', 'name labelColor')
    .exec();

  appAssert(popularArticles.length > 0, EHttpCodes.NOT_FOUND, 'Nie znaleziono popularnych artykułów');
  return popularArticles;
};

export const getByUser = async (userId: string, startDate: string, endDate: string): Promise<IArticle[]> => {
  // Typ obiektu filter
  const filter: {
    createdBy: string;
    isTrashed: boolean;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
  } = {
    createdBy: userId,
    isTrashed: false,
  };

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate.toString()); // Data większa lub równa
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate.toString()); // Data mniejsza lub równa
    }
  }

  return ArticleModel.find(filter).select(['title', 'createdAt', 'isVerified']);
};

export const getMany = async (
  userId: string,
  req: express.Request,
): Promise<{ data: IArticleEntity[]; pagination: { total: number; page: number; pages: number } }> => {
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

  return {
    data: articlesWithFavourites,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  };
};

export const getTrashed = async (
  userId: string,
  req: express.Request,
): Promise<{ data: IArticleEntity[]; pagination: { total: number; page: number; pages: number } }> => {
  const query = {
    ...constructSearchQuery(req.query),
    isTrashed: { $ne: false },
  };
  const user = await UserModel.findById(userId).select('favourites');
  const favouritesList = user?.favourites;

  const limit = parseInt((req.query.limit as string) ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt((req.query.page as string) ?? '1');
  const skip = (pageNumber - 1) * pageSize;
  const sortBy = (req.query.sortBy as string) ?? '-createdAt';
  const articles = await ArticleModel.find(query)
    .select(['-clientDescription', '-employeeDescription', '-verifiedBy', '-updatedAt', '-viewsCounter', '-__v'])
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

  return {
    data: articlesWithFavourites,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  };
};
