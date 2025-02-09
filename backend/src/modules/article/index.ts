import Log from 'simpl-loggar';
import ArticleHistoryModel from './history.model.js';
import ArticleModel from './schema.model.js';
import { EEventType } from '../../enums/events.js';
import { EHttpCodes } from '../../enums/http.js';
import {
  getArticleHistory as getArticleHistoryService,
  saveArticleChanges,
} from '../../services/articleHistory.service.js';
import appAssert from '../../utils/appAssert.js';
import NotificationModel from '../notification/model.js';
import UserModel from '../user/model.js';
import type { IArticle, IArticleHistory } from '../../types/article.js';
import type mongoose from 'mongoose';

interface ICreateArticleRequest {
  title: string;
  employeeDescription: string;
  tags: string[];
  clientDescription: string;
  product: string;
}

interface IGetArticleParams {
  userId: string;
  articleId: string;
}

interface ICreateArticleParams {
  request: ICreateArticleRequest;
  userId: string; // Zakładam, że userId to string
}

export const createArticle = async ({ request, userId }: ICreateArticleParams): Promise<IArticle> => {
  const { title, employeeDescription, tags, clientDescription, product } = request;

  const article = await ArticleModel.exists({ title });
  appAssert(!article, EHttpCodes.CONFLICT, 'Article already exists');

  const newArticle = await ArticleModel.create({
    title,
    employeeDescription,
    clientDescription,
    tags,
    product,
    createdBy: userId,
    verifiedBy: userId,
  });

  Log.debug('Article controller', newArticle, 'newArticle');

  await saveArticleChanges({
    articleId: newArticle?._id.toString(),
    updatedBy: userId,
    articleBeforeChanges: null,
    updatedArticle: newArticle,
    eventType: EEventType.Created,
  });

  const notification = await NotificationModel.create({
    userId,
    type: 'info',
    message: 'Dodano nowy artykuł',
    articleTitle: newArticle.title, // Dodajemy tytuł
    articleProduct: newArticle.product, // Dodajemy produkt
    link: `/articles/${newArticle._id.toString()}`, // Link do artykułu
  });

  Log.debug('Created notification', notification);
  await notification.save();

  return newArticle;
};

export const getLatestArticles = async (limit: number): Promise<IArticle[]> => {
  return ArticleModel.find({}, { title: 1, createdAt: 1 })
    .populate([{ path: 'product', select: ['name', 'labelColor'] }])
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getPopularArticles = async (limit: number): Promise<IArticle[]> => {
  const popularArticles = await ArticleModel.find({ isTrashed: false })
    .sort({ viewsCounter: -1 })
    .limit(limit)
    .select('title product')
    .populate('product', 'name labelColor')
    .exec();

  appAssert(popularArticles.length > 0, EHttpCodes.NOT_FOUND, 'Nie znaleziono popularnych artykułów');
  return popularArticles;
};

export const verifyArticle = async (id: string, isVerified: boolean, userId: string): Promise<void> => {
  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');
  Log.debug('IsVerified', isVerified);
  const isVerifiedChanged = article.isVerified !== isVerified;
  article.isVerified = isVerified;
  const updatedAritlce = await article.save();
  const updatedAritlceObj = updatedAritlce.toObject();

  if (isVerifiedChanged) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: userId, // Id użytkownika, który dokonał zmiany
      eventType: isVerified ? EEventType.verified : EEventType.Unverified,
    });
  }
};

export const markFavorite = async (id: string, userId: string): Promise<boolean> => {
  const user = await UserModel.findById({ _id: userId });
  appAssert(user, EHttpCodes.NOT_FOUND, 'User not found');

  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const isFavorite = user?.favourites.includes(article._id);

  if (isFavorite) {
    user.favourites = user?.favourites.filter((favoriteId) => favoriteId.toString() !== article._id.toString());
  } else {
    user.favourites.push(article._id);
  }

  await UserModel.findByIdAndUpdate(userId, { favourites: user.favourites });

  return isFavorite;
};

export const updateArticle = async (
  id: string,
  userId: string,
  title: string,
  clientDescription: string,
  employeeDescription: string,
  tags: mongoose.Types.ObjectId[],
  product: mongoose.Types.ObjectId,
): Promise<void> => {
  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const articleBeforeChanges = article.toObject();

  article.title = title ?? article.title;
  article.clientDescription = clientDescription ?? article.clientDescription;
  article.employeeDescription = employeeDescription ?? article.employeeDescription;
  article.tags = tags ?? article.tags;
  article.product = product ?? article.product;

  const updatedArticle = await article.save();
  const updatedArticleObject = updatedArticle.toObject();

  await saveArticleChanges({
    articleId: id,
    updatedBy: userId,
    articleBeforeChanges,
    updatedArticle: updatedArticleObject,
    eventType: EEventType.Updated,
  });
};

export const getFavorite = async (
  page: string | undefined,
  userId: string,
): Promise<{ favouriteArticles: IArticle[]; totalFavouriteArticles: number; pageNumber: number; pageSize: number }> => {
  const pageSize = 15; // Liczba wyników na stronę
  const pageNumber = parseInt((page as string) ?? '1');
  const skip = (pageNumber - 1) * pageSize;

  // Znalezienie użytkownika na podstawie ID i pobranie ulubionych artykułów
  const user = await UserModel.findById(userId).select('favourites');

  if (!user) {
    throw new Error('User not found');
  }

  // Wyciągnięcie tablicy ID artykułów z ulubionych
  const { favourites } = user;

  // Pobranie artykułów na podstawie ID w ulubionych z paginacją
  const favouriteArticles = await ArticleModel.find({
    _id: { $in: favourites },
  })
    .select([
      '-clientDescription',
      '-employeeDescription',
      '-createdBy',
      '-verifiedBy',
      '-createdAt',
      '-viewsCounter',
      '-__v',
    ])
    .populate([{ path: 'tags', select: ['name'] }])
    .skip(skip)
    .limit(pageSize);

  // Jeśli chcesz, możesz również zwrócić całkowitą liczbę ulubionych artykułów, aby obsłużyć paginację na froncie
  const totalFavouriteArticles = await ArticleModel.countDocuments({
    _id: { $in: favourites },
  });

  return {
    favouriteArticles,
    totalFavouriteArticles,
    pageNumber,
    pageSize,
  };
};

export const removeArticle = async (id: string): Promise<void> => {
  // Znalezienie artykułu
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  // Usunięcie artykułu
  const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: id });
  appAssert(deletedArticle, EHttpCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');

  // Usunięcie powiązanej historii
  await ArticleHistoryModel.deleteMany({ articleId: id });
};

export const trashArticle = async (id: string, userId: string): Promise<void> => {
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  article.isTrashed = true;
  const trashedArticle = await article.save();

  const updatedAritlceObj = trashedArticle.toObject();

  if (updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article,
      updatedArticle: updatedAritlceObj,
      updatedBy: userId,
      eventType: EEventType.Trashed,
    });
  }
};

export const restoreArticle = async (id: string, userId: string): Promise<void> => {
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  article.isTrashed = false;
  const restoredArticle = await article.save();

  const updatedAritlceObj = restoredArticle.toObject();

  if (!updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: userId, // Id użytkownika, który dokonał zmiany
      eventType: EEventType.Restored, // Typ zdarzenia: 'updated'
    });
  }
};

export const getArticleHistory = async (articleId: string): Promise<unknown[]> => {
  return getArticleHistoryService({ articleId });
};

export const getArticlesByUser = async (userId: string, startDate: string, endDate: string): Promise<IArticle[]> => {
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

export const getUserHistory = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<IArticleHistory[]> => {
  // Tworzymy podstawowy filtr
  const filter: {
    updatedBy: string;
    updatedAt?: {
      $gte?: Date;
      $lte?: Date;
    };
    eventType: string;
    articleId?: { $ne: null };
  } = {
    updatedBy: userId,
    eventType: 'updated',
    articleId: { $ne: null }, // Wyklucz historię bez powiązanego artykułu
  };

  // Dodajemy filtr dat, jeśli są podane
  if (startDate || endDate) {
    filter.updatedAt = {};
    if (startDate) {
      filter.updatedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.updatedAt.$lte = new Date(endDate);
    }
  }

  // Zapytanie do bazy danych
  return ArticleHistoryModel.find(filter)
    .populate({
      path: 'articleId', // Powiązanie z artykułem
      select: ['title', 'isTrashed'], // Pobierz tylko potrzebne pola
      match: { isTrashed: false }, // Wyklucz artykuły, które są w koszu
    })
    .populate({
      path: 'updatedBy', // Powiązanie z użytkownikiem
      select: 'name surname', // Pobierz imię i nazwisko użytkownika
    })
    .exec();
};

export const incrementArticleViews = async ({ articleId }: { articleId: string }): Promise<{ status: EHttpCodes }> => {
  const article = await ArticleModel.findById(articleId);
  appAssert(article, EHttpCodes.CONFLICT, 'Article already exists');

  article.viewsCounter = article.viewsCounter + 1;
  await article.save();
  return { status: EHttpCodes.OK };
};

export const getArticle = async ({ userId, articleId }: IGetArticleParams) => {
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

// ARTICLES

// interface GetArticlesOptions {
//     title?: string;
//     tags?: string[];
//     author?: string;
//     verified?: boolean;
//     limit: number;
//     page: number;
//     sortBy: string;
//   }

//   export const getAllArticles = async ({options,req}:{options:GetArticlesOptions,req:Express.Request} ) => {
//     const { title, tags, author, verified, limit, page, sortBy } = options;

//     const query: any = {};

//     // Konstruowanie zapytania
//     if (title) {
//       query.title = new RegExp(title, "i");
//     }

//     if (tags) {
//       query.tags = { $all: tags };
//     }

//     if (author) {
//       query.createdBy = author;
//     }

//     if (verified !== undefined) {
//       query.isVerified = verified;
//     }

//     const pageSize = limit;
//     const skipp = (page - 1) * pageSize;

//     const articles = await ArticleModel.find(query)
//       .select([
//         "-clientDescription",
//         "-employeeDescription",
//         "-verifiedBy",
//         "-updatedAt",
//         "-viewsCounter",
//         "-__v",
//       ])
//       .populate([
//         { path: "tags", select: ["name", "shortname"] },
//         { path: "createdBy", select: ["name", "surname"] },
//       ])
//       .skip(skipp)
//       .limit(pageSize)
//       .sort(sortBy);

//     const total = await ArticleModel.countDocuments(query);

//     return {
//       articles,
//       total,
//       pages: Math.ceil(total / pageSize),
//       currentPage: page,
//     };
//   };
