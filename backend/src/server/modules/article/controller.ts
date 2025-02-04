import Log from 'simpl-loggar';
import { EEventType } from '../../../enums/events.js';
import { EHttpCodes } from '../../../enums/http.js';
import { createArticle, getArticle, incrementArticleViews } from '../../../modules/article/index.js';
import { newArticleSchema } from '../../../modules/article/schema.js';
import ArticleModel from '../../../modules/article/schema.model.js';
import UserModel from '../../../modules/user/model.js';
import { getArticleHistory, saveArticleChanges } from '../../../services/articleHistory.service.js';
import appAssert from '../../../utils/appAssert.js';
import catchErrors from '../../../utils/catchErrors.js';
import constructSearchQuery from '../../../utils/constructSearchQuery.js';
import ArticleHistoryModel from 'modules/article/history.model.js';

export const createArticleHandler = catchErrors(async (req, res) => {
  const request = newArticleSchema.parse(req.body);
  const { userId } = req;
  const newArticle = await createArticle({ request, userId });

  Log.debug('Article controller', newArticle, 'newArticle');

  await saveArticleChanges({
    articleId: newArticle?._id.toString(),
    updatedBy: req.userId,
    articleBeforeChanges: null,
    updatedArticle: newArticle,
    eventType: EEventType.Created,
  });

  return res.status(EHttpCodes.OK).json({ message: 'Dodano nowy artykuł', data: newArticle });
});

export const getLatestArticlesForDashboard = catchErrors(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 4;

  const latestArticles = await ArticleModel.find({}, { title: 1, createdAt: 1 })
    .populate([{ path: 'product', select: ['name', 'labelColor'] }])
    .sort({ createdAt: -1 }) // Sortowanie malejąco po dacie
    .limit(limit); // Ograniczenie liczby wyników

  return res.status(EHttpCodes.OK).json(latestArticles);
});

export const getArticlesHandler = catchErrors(async (req, res) => {
  const { userId } = req;
  const query = {
    ...constructSearchQuery(req.query),
    isTrashed: { $ne: true },
  };
  const user = await UserModel.findById(userId).select('favourites');
  const favouritesList = user?.favourites;

  const limit = parseInt(req.query.limit?.toString() ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
  const skipp = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy ? req.query.sortBy.toString() : '-createdAt';
  const articles = await ArticleModel.find(query)
    .select(['-clientDescription', '-employeeDescription', '-verifiedBy', '-updatedAt', '-__v'])
    .populate([
      { path: 'tags', select: ['name', 'shortname'] },
      { path: 'createdBy', select: ['name', 'surname'] },
      { path: 'product', select: ['name', 'labelColor', 'banner'] },
    ])
    .skip(skipp)
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

export const getTrashedArticlesHandler = catchErrors(async (req, res) => {
  const { userId } = req;
  const query = {
    ...constructSearchQuery(req.query),
    isTrashed: { $ne: false },
  };
  const user = await UserModel.findById(userId).select('favourites');
  const favouritesList = user?.favourites;

  const limit = parseInt(req.query.limit?.toString() ?? '20');
  const pageSize = limit;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
  const skipp = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy ? req.query.sortBy.toString() : '-createdAt';
  const articles = await ArticleModel.find(query)
    .select(['-clientDescription', '-employeeDescription', '-verifiedBy', '-updatedAt', '-viewsCounter', '-__v'])
    .populate([
      { path: 'tags', select: ['name', 'shortname'] },
      { path: 'createdBy', select: ['name', 'surname'] },
      { path: 'product', select: ['name', 'labelColor', 'banner'] },
    ])
    .skip(skipp)
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

export const getArticleHandler = catchErrors(async (req, res) => {
  const { userId }: { userId: string } = req;
  const { id } = req.params;

  const article = await getArticle({ userId, articleId: id as string });
  await incrementArticleViews({ articleId: article?._id.toString() });
  return res.status(EHttpCodes.OK).json(article);
});

export const getArticleHistoryHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  const articleHistory = await getArticleHistory({ articleId: id as string });
  Log.debug('Article history', articleHistory);
  return res.status(EHttpCodes.OK).json(articleHistory);
});

export const verifyArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.CONFLICT, 'Article not found');
  Log.debug('IsVerified', isVerified);
  const isVerifiedChanged = article.isVerified !== isVerified;
  article.isVerified = isVerified;
  const updatedAritlce = await article.save();
  const updatedAritlceObj = updatedAritlce.toObject();

  if (isVerifiedChanged) {
    await saveArticleChanges({
      articleId: id as string,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: req.userId, // Id użytkownika, który dokonał zmiany
      eventType: isVerified ? EEventType.verified : EEventType.Unverified,
    });
  }

  res.status(EHttpCodes.OK).json({
    message: `${isVerified ? 'Artykuł został zweryfikowany' : 'Artykuł został oznaczony jako do weryfikacji'}`,
  });
});

export const markAsFavouriteHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId }: { userId: string } = req;

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

  res.status(EHttpCodes.OK).json({
    message: `${isFavorite ? 'Usunięto artykuł z listy ulubionych' : ' Dodano artkuł do listy ulubionych'}`,
  });
});

export const getFavouriteArticlesHandler = catchErrors(async (req, res) => {
  const { userId }: { userId: string } = req;
  const pageSize = 15; // Liczba wyników na stronę
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1');
  const skip = (pageNumber - 1) * pageSize;

  // Znalezienie użytkownika na podstawie ID i pobranie ulubionych artykułów
  const user = await UserModel.findById(userId).select('favourites');

  if (!user) {
    res.status(403).json({ message: 'User not found' });
    return;
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

  res.status(200).json({
    data: favouriteArticles,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalFavouriteArticles / pageSize),
  });
});

export const getPopularArticlesHandler = catchErrors(async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() || '20');

  const popularArticles = await ArticleModel.find({ isTrashed: false })
    .sort({ viewsCounter: -1 })
    .limit(limit)
    .select('title product')
    .populate('product', 'name labelColor')
    .exec();

  appAssert(popularArticles.length > 0, EHttpCodes.NOT_FOUND, 'Nie znaleziono popularnych artykułów');

  return res.status(EHttpCodes.OK).json(popularArticles);
});

export const trashArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  article.isTrashed = true;
  const trashedArticle = await article.save();

  const updatedAritlceObj = trashedArticle.toObject();

  if (updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id as string,
      articleBeforeChanges: article,
      updatedArticle: updatedAritlceObj,
      updatedBy: req.userId,
      eventType: EEventType.Trashed,
    });
  }

  return res.status(EHttpCodes.OK).json({ message: 'Artykuł został usunięty' });
});

export const restoreArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  article.isTrashed = false;
  const restoredArticle = await article.save();

  const updatedAritlceObj = restoredArticle.toObject();

  if (!updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id as string,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: req.userId, // Id użytkownika, który dokonał zmiany
      eventType: EEventType.Restored, // Typ zdarzenia: 'updated'
    });
  }

  return res.status(EHttpCodes.OK).json({ message: 'Artykuł został przywrócony z kosza' });
});

export const deleteArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  // Znalezienie artykułu
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  // Usunięcie artykułu
  const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: id });
  appAssert(deletedArticle, EHttpCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');

  // Usunięcie powiązanej historii
  await ArticleHistoryModel.deleteMany({ articleId: id });

  // Odpowiedź
  return res.status(EHttpCodes.OK).json({ message: 'Artykuł i powiązana historia zostały usunięte.' });
});

export const updateArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { title, clientDescription, employeeDescription, tags, product } = req.body;

  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, EHttpCodes.NOT_FOUND, 'Article not found');

  const articleBeforeChanges = article.toObject();

  article.title = title || article.title;
  article.clientDescription = clientDescription || article.clientDescription;
  article.employeeDescription = employeeDescription || article.employeeDescription;
  article.tags = tags || article.tags;
  article.product = product || article.product;

  const updatedArticle = await article.save();
  const updatedArticleObject = updatedArticle.toObject();

  await saveArticleChanges({
    articleId: id as string,
    updatedBy: req.userId,
    articleBeforeChanges,
    updatedArticle: updatedArticleObject,
    eventType: EEventType.Updated,
  });

  res.status(EHttpCodes.OK).json({ message: 'Artykuł został zaktualizowany' });
});

export const getArticlesCreatedBySelectedUser = catchErrors(async (req, res) => {
  const { id: userId } = req.params;
  const { startDate, endDate } = req.query;

  // Typ obiektu filter
  const filter: {
    createdBy: string;
    isTrashed: boolean;
    createdAt?: {
      $gte?: Date;
      $lte?: Date;
    };
  } = {
    createdBy: userId as string,
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

  const userArticles = await ArticleModel.find(filter).select(['title', 'createdAt', 'isVerified']);

  return res.status(200).json(userArticles);
});

export const getArticlesHistoryByUser = catchErrors(async (req, res) => {
  const { id: userId } = req.params;
  const { startDate, endDate } = req.query;

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
    updatedBy: userId as string,
    eventType: 'updated',
    articleId: { $ne: null }, // Wyklucz historię bez powiązanego artykułu
  };

  // Dodajemy filtr dat, jeśli są podane
  if (startDate || endDate) {
    filter.updatedAt = {};
    if (startDate) {
      filter.updatedAt.$gte = new Date(startDate.toString());
    }
    if (endDate) {
      filter.updatedAt.$lte = new Date(endDate.toString());
    }
  }

  // Zapytanie do bazy danych
  const userHistory = await ArticleHistoryModel.find(filter)
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

  // Zwracamy tylko rekordy, w których `articleId` nie jest nullem
  return res.status(200).json(userHistory.filter((entry) => entry.articleId));
});
