import EventType from "../constants/articleEventTypes";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../constants/http";
import ArticleModel from "../models/Article.model";
import UserModel from "../models/User.model";
import {
  createArticle,
  getArticle,
  incrementArticleViews,
} from "../services/article.service";
import {
  getArticleHistory,
  saveArticleChanges,
} from "../services/articleHistory.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { constructSearchQuery } from "../utils/constructSearchQuery";
import { newArticleSchema } from "./article.schemas";

export const createArticleHandler = catchErrors(async (req, res) => {
  const request = newArticleSchema.parse(req.body);
  const { userId } = req;
  const newArticle = await createArticle({ request, userId });

  console.log(newArticle);
  console.log("newArticle");

  await saveArticleChanges({
    articleId: newArticle?._id.toString(),
    updatedBy: req.userId,
    articleBeforeChanges: null,
    updatedArticle: newArticle,
    eventType: EventType.Created,
  });

  return res
    .status(OK)
    .json({ message: "Dodano nowy artykuł", data: newArticle });
});

export const getLatestArticlesForDashboard = catchErrors(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 4;

  const latestArticles = await ArticleModel.find({}, { title: 1, createdAt: 1 })
    .sort({ createdAt: -1 }) // Sortowanie malejąco po dacie
    .limit(limit); // Ograniczenie liczby wyników

  return res.status(OK).json(latestArticles);
});

export const getArticlesHandler = catchErrors(async (req, res) => {
  const { userId } = req;
  const query = {
    ...constructSearchQuery(req.query),
    isTrashed: { $ne: true },
  };
  const user = await UserModel.findById(userId).select("favourites");
  const favouritesList = user?.favourites;

  const limit = parseInt(req.query.limit?.toString() || "20");
  const pageSize = limit;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skipp = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "-createdAt";
  const articles = await ArticleModel.find(query)
    .select([
      "-clientDescription",
      "-employeeDescription",
      "-verifiedBy",
      "-updatedAt",
      "-__v",
    ])
    .populate([
      { path: "tags", select: ["name", "shortname"] },
      { path: "createdBy", select: ["name", "surname"] },
      { path: "product", select: ["name", "labelColor", "banner"] },
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

  return res.status(OK).json(responseObject);
});

export const getTrashedArticlesHandler = catchErrors(async (req, res) => {
  const { userId } = req;
  const query = {
    ...constructSearchQuery(req.query),
    isTrashed: { $ne: false },
  };
  const user = await UserModel.findById(userId).select("favourites");
  const favouritesList = user?.favourites;

  const limit = parseInt(req.query.limit?.toString() || "20");
  const pageSize = limit;
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skipp = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy ? req.query.sortBy.toString() : "-createdAt";
  const articles = await ArticleModel.find(query)
    .select([
      "-clientDescription",
      "-employeeDescription",
      "-verifiedBy",
      "-updatedAt",
      "-viewsCounter",
      "-__v",
    ])
    .populate([
      { path: "tags", select: ["name", "shortname"] },
      { path: "createdBy", select: ["name", "surname"] },
      { path: "product", select: ["name", "labelColor", "banner"] },
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

  return res.status(OK).json(responseObject);
});

export const getArticleHandler = catchErrors(async (req, res) => {
  const { userId }: { userId: string } = req;
  const { id } = req.params;

  const article = await getArticle({ userId, articleId: id });
  incrementArticleViews({ articleId: article?._id.toString() });
  return res.status(OK).json(article);
});

export const getArticleHistoryHandler = catchErrors(async (req, res) => {
  const { userId }: { userId: string } = req;
  const { id } = req.params;

  const articleHistory = await getArticleHistory({ articleId: id });
  console.log(articleHistory);
  return res.status(OK).json(articleHistory);
});

export const verifyArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, CONFLICT, "Article not found");
  console.log("isVerified");
  console.log(isVerified);
  const isVerifiedChanged = article.isVerified !== isVerified;
  article.isVerified = isVerified;
  const updatedAritlce = await article.save();
  const updatedAritlceObj = updatedAritlce.toObject();

  if (isVerifiedChanged) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: req.userId, // Id użytkownika, który dokonał zmiany
      eventType: isVerified ? EventType.verified : EventType.Unverified,
    });
  }

  res.status(OK).json({
    message: `${
      isVerified
        ? "Artykuł został zweryfikowany"
        : "Artykuł został oznaczony jako do weryfikacji"
    }`,
  });
});

export const markAsFavouriteHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId }: { userId: string } = req;

  const user = await UserModel.findById({ _id: userId });
  appAssert(user, NOT_FOUND, "User not found");

  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, NOT_FOUND, "Article not found");

  const isFavorite = user?.favourites.includes(article._id);

  if (isFavorite) {
    user.favourites = user?.favourites.filter(
      (favoriteId) => favoriteId.toString() !== article._id.toString()
    );
  } else {
    user.favourites.push(article._id);
  }

  await UserModel.findByIdAndUpdate(userId, { favourites: user.favourites });

  res.status(OK).json({
    message: `${
      isFavorite
        ? "Usunięto artykuł z listy ulubionych"
        : " Dodano artkuł do listy ulubionych"
    }`,
  });
});

export const getFavouriteArticlesHandler = catchErrors(async (req, res) => {
  const { userId }: { userId: string } = req;
  const pageSize = 15; // Liczba wyników na stronę
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
  const skip = (pageNumber - 1) * pageSize;

  // Znalezienie użytkownika na podstawie ID i pobranie ulubionych artykułów
  const user = await UserModel.findById(userId).select("favourites");

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  // Wyciągnięcie tablicy ID artykułów z ulubionych
  const favourites = user.favourites;

  // Pobranie artykułów na podstawie ID w ulubionych z paginacją
  const favouriteArticles = await ArticleModel.find({
    _id: { $in: favourites },
  })
    .select([
      "-clientDescription",
      "-employeeDescription",
      "-createdBy",
      "-verifiedBy",
      "-createdAt",
      "-viewsCounter",
      "-__v",
    ])
    .populate([{ path: "tags", select: ["name"] }])
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

export const trashArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, NOT_FOUND, "Article not found");

  article.isTrashed = true;
  const trashedArticle = await article.save();

  const updatedAritlceObj = trashedArticle.toObject();

  if (updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: req.userId, // Id użytkownika, który dokonał zmiany
      eventType: EventType.Trashed, // Typ zdarzenia: 'updated'
    });
  }

  return res.status(OK).json({ message: "Artykuł został usunięty" });
});

export const restoreArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, NOT_FOUND, "Article not found");

  article.isTrashed = false;
  const restoredArticle = await article.save();

  const updatedAritlceObj = restoredArticle.toObject();

  if (!updatedAritlceObj?.isTrashed) {
    await saveArticleChanges({
      articleId: id,
      articleBeforeChanges: article, // Artykuł przed zmianą
      updatedArticle: updatedAritlceObj, // Artykuł po zmianie
      updatedBy: req.userId, // Id użytkownika, który dokonał zmiany
      eventType: EventType.Restored, // Typ zdarzenia: 'updated'
    });
  }

  return res.status(OK).json({ message: "Artykuł został przywrócony z kosza" });
});

export const deleteArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findById({ _id: id });
  appAssert(article, NOT_FOUND, "Article not found");
  const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: id });
  appAssert(deletedArticle, INTERNAL_SERVER_ERROR, "Something went wrong");
  return res.status(OK).json({ message: "Artykuł został usunięty." });
});

export const updateArticleHandler = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { title, clientDescription, employeeDescription, tags, product } =
    req.body;

  const article = await ArticleModel.findById({ _id: id });

  appAssert(article, NOT_FOUND, "Article not found");

  const articleBeforeChanges = article.toObject();

  article.title = title || article.title;
  article.clientDescription = clientDescription || article.clientDescription;
  article.employeeDescription =
    employeeDescription || article.employeeDescription;
  article.tags = tags || article.tags;
  article.product = product || article.product;

  const updatedArticle = await article.save();
  const updatedArticleObject = updatedArticle.toObject();

  await saveArticleChanges({
    articleId: id,
    updatedBy: req.userId,
    articleBeforeChanges,
    updatedArticle: updatedArticleObject,
    eventType: EventType.Updated,
  });

  res.status(OK).json({ message: "Artykuł został zaktualizowany" });
});
