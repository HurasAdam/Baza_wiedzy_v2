import EventType from "@/constants/articleEventTypes";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "@/constants/http";
import ArticleHistoryModel from "@/features/article-history/article-history.model";
import { getArticleHistory, saveArticleChanges } from "@/features/article-history/article-history.service";
import TagModel from "@/features/tag/tag.model";
import UserModel from "@/features/user/user.model";
import appAssert from "@/utils/appAssert";
import catchErrors from "@/utils/catchErrors";
import { constructSearchQuery } from "@/utils/constructSearchQuery";
import ArticleModel from "./article.model";
import { newArticleSchema } from "./article.schema";
import { createArticle as createArticleAction, getArticle, incrementArticleViews } from "./article.service";

export const ArticleController = () => ({
    createArticle: catchErrors(async (req, res) => {
        const request = newArticleSchema.parse(req.body);
        const { userId } = req;
        const newArticle = await createArticleAction({ request, userId });

        console.log(newArticle);
        console.log("newArticle");

        await saveArticleChanges({
            articleId: newArticle?._id.toString(),
            updatedBy: req.userId,
            articleBeforeChanges: null,
            updatedArticle: newArticle,
            eventType: EventType.Created,
        });

        return res.status(OK).json({ message: "Dodano nowy artykuł", data: newArticle });
    }),

    getLatestArticles: catchErrors(async (req, res) => {
        const limit = parseInt(req.query.limit as string) || 4;

        const latestArticles = await ArticleModel.find({}, { title: 1, createdAt: 1 })
            .populate([{ path: "product", select: ["name", "labelColor"] }])
            .sort({ createdAt: -1 }) // Sortowanie malejąco po dacie
            .limit(limit); // Ograniczenie liczby wyników

        return res.status(OK).json(latestArticles);
    }),

    getArticles: catchErrors(async (req, res) => {
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
            .select(["-clientDescription", "-employeeDescription", "-verifiedBy", "-updatedAt", "-__v"])
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
    }),

    getTrashedArticles: catchErrors(async (req, res) => {
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
    }),

    getArticle: catchErrors(async (req, res) => {
        const { userId }: { userId: string } = req;
        const { id } = req.params;

        const article = await getArticle({ userId, articleId: id });
        incrementArticleViews({ articleId: article?._id.toString() });
        return res.status(OK).json(article);
    }),

    getArticleHistory: catchErrors(async (req, res) => {
        const { userId }: { userId: string } = req;
        const { id } = req.params;

        const articleHistory = await getArticleHistory({ articleId: id });
        console.log(articleHistory);
        return res.status(OK).json(articleHistory);
    }),

    getHistoryItem: catchErrors(async (req, res) => {
        const { id } = req.params;

        // Pobranie historii artykułu
        const historyItem = await ArticleHistoryModel.findById(id).populate("updatedBy", "name surname"); // Pobieramy tylko imię i nazwisko
        console.log("CHECKER");
        console.log(historyItem);

        if (!historyItem) {
            return res.status(404).json({ message: "Historia nie znaleziona" });
        }

        // Sprawdzenie, czy w historii są zmiany dla pola "tags"
        const updatedChanges = await Promise.all(
            historyItem.changes.map(async (change) => {
                if (change.field === "tags") {
                    // Pobranie nazw tagów
                    const oldTags = await TagModel.find({ _id: { $in: JSON.parse(change.oldValue || "[]") } }).select(
                        "name"
                    );
                    const newTags = await TagModel.find({ _id: { $in: JSON.parse(change.newValue || "[]") } }).select(
                        "name"
                    );

                    return {
                        ...change.toObject(),
                        oldValue: oldTags.map((tag) => tag.name), // Zamiana ID na nazwę
                        newValue: newTags.map((tag) => tag.name), // Zamiana ID na nazwę
                    };
                }
                return change;
            })
        );

        return res.status(200).json({ ...historyItem.toObject(), changes: updatedChanges });
    }),

    verifyArticle: catchErrors(async (req, res) => {
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
            message: `${isVerified ? "Artykuł został zweryfikowany" : "Artykuł został oznaczony jako do weryfikacji"}`,
        });
    }),

    markAsFavourite: catchErrors(async (req, res) => {
        const { id } = req.params;
        const { userId }: { userId: string } = req;

        const user = await UserModel.findById({ _id: userId });
        appAssert(user, NOT_FOUND, "User not found");

        const article = await ArticleModel.findById({ _id: id });
        appAssert(article, NOT_FOUND, "Article not found");

        const isFavorite = user?.favourites.includes(article._id);

        if (isFavorite) {
            user.favourites = user?.favourites.filter((favoriteId) => favoriteId.toString() !== article._id.toString());
        } else {
            user.favourites.push(article._id);
        }

        await UserModel.findByIdAndUpdate(userId, { favourites: user.favourites });

        res.status(OK).json({
            message: `${isFavorite ? "Usunięto artykuł z listy ulubionych" : " Dodano artkuł do listy ulubionych"}`,
        });
    }),

    getPopularArticles: catchErrors(async (req, res) => {
        const limit = parseInt(req.query.limit?.toString() || "20");

        const popularArticles = await ArticleModel.find({ isTrashed: false })
            .sort({ viewsCounter: -1 })
            .limit(limit)
            .select("title product")
            .populate("product", "name labelColor")
            .exec();

        appAssert(popularArticles.length > 0, NOT_FOUND, "Nie znaleziono popularnych artykułów");

        return res.status(OK).json(popularArticles);
    }),

    trashArticle: catchErrors(async (req, res) => {
        const { id } = req.params;
        const article = await ArticleModel.findById({ _id: id });
        appAssert(article, NOT_FOUND, "Article not found");

        article.isTrashed = true;
        const trashedArticle = await article.save();

        const updatedAritlceObj = trashedArticle.toObject();

        if (updatedAritlceObj?.isTrashed) {
            await saveArticleChanges({
                articleId: id,
                articleBeforeChanges: article,
                updatedArticle: updatedAritlceObj,
                updatedBy: req.userId,
                eventType: EventType.Trashed,
            });
        }

        return res.status(OK).json({ message: "Artykuł został usunięty" });
    }),

    restoreArticle: catchErrors(async (req, res) => {
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
    }),

    deleteArticle: catchErrors(async (req, res) => {
        const { id } = req.params;

        // Znalezienie artykułu
        const article = await ArticleModel.findById({ _id: id });
        appAssert(article, NOT_FOUND, "Article not found");

        // Usunięcie artykułu
        const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: id });
        appAssert(deletedArticle, INTERNAL_SERVER_ERROR, "Something went wrong");

        // Usunięcie powiązanej historii
        await ArticleHistoryModel.deleteMany({ articleId: id });

        // Odpowiedź
        return res.status(OK).json({ message: "Artykuł i powiązana historia zostały usunięte." });
    }),

    updateArticle: catchErrors(async (req, res) => {
        const { id } = req.params;
        const { title, clientDescription, employeeDescription, tags, product } = req.body;

        const article = await ArticleModel.findById({ _id: id });

        appAssert(article, NOT_FOUND, "Article not found");

        const articleBeforeChanges = article.toObject();

        article.title = title || article.title;
        article.clientDescription = clientDescription || article.clientDescription;
        article.employeeDescription = employeeDescription || article.employeeDescription;
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
    }),

    getArticlesCreatedByUser: catchErrors(async (req, res) => {
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

        const userArticles = await ArticleModel.find(filter).select(["title", "createdAt", "isVerified"]);

        return res.status(200).json(userArticles);
    }),

    getArticlesHistoryByUser: catchErrors(async (req, res) => {
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
            updatedBy: userId,
            eventType: "updated",
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
                path: "articleId", // Powiązanie z artykułem
                select: ["title", "isTrashed"], // Pobierz tylko potrzebne pola
                match: { isTrashed: false }, // Wyklucz artykuły, które są w koszu
            })
            .populate({
                path: "updatedBy", // Powiązanie z użytkownikiem
                select: "name surname", // Pobierz imię i nazwisko użytkownika
            })
            .exec();

        // Zwracamy tylko rekordy, w których `articleId` nie jest nullem
        return res.status(200).json(userHistory.filter((entry) => entry.articleId));
    }),
});
