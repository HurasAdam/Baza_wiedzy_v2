import EventType from "@/constants/articleEventTypes";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { constructSearchQuery } from "@/utils/constructSearchQuery";
import ArticleHistoryModel from "../article-history/article-history.model";
import { getArticleHistory, saveArticleChanges } from "../article-history/article-history.service";
import TagModel from "../tag/tag.model";
import UserModel from "../user/user.model";
import { UserService } from "../user/user.service";
import ArticleModel from "./article.model";
import type { CreateArticleDto } from "./dto/create-article.dto";
import type { SearchArticlesDto } from "./dto/search-articles.dto";

export const ArticleService = {
    async create(userId: string, payload: CreateArticleDto) {
        const article = await ArticleModel.exists({ title: payload.title });
        appAssert(!article, CONFLICT, "Article already exists");

        const nextArticle = await ArticleModel.create({
            ...payload,
            createdBy: userId,
            verifiedBy: userId,
        });

        await saveArticleChanges({
            articleId: nextArticle?._id.toString(),
            updatedBy: userId,
            articleBeforeChanges: null,
            updatedArticle: nextArticle,
            eventType: EventType.Created,
        });

        return nextArticle;
    },

    async find(userId: string, query: SearchArticlesDto, findTrashed = false) {
        const querydb = {
            ...constructSearchQuery(query),
            isTrashed: findTrashed,
        };

        const { limit, page, sortBy, sortAt } = query;
        const skip = (page - 1) * limit;

        const articles = await ArticleModel.find(querydb)
            .select(["-clientDescription", "-employeeDescription", "-verifiedBy", "-updatedAt", "-__v"])
            .populate([
                { path: "tags", select: ["name", "shortname"] },
                { path: "createdBy", select: ["name", "surname"] },
                { path: "product", select: ["name", "labelColor", "banner"] },
                { path: "category", select: ["name"] },
            ])
            .skip(skip)
            .limit(limit)
            .sort([[sortBy, sortAt]]);

        const total = await ArticleModel.countDocuments(querydb);
        const { favourites } = await UserService.findOne(userId);

        const articlesWithFavourites = articles.map((article) => ({
            ...article.toObject(),
            isFavourite: favourites.some((favId) => favId.equals(article._id)),
        }));

        return {
            data: articlesWithFavourites,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        };
    },

    async findOne(userId: string, articleId: string, findTrashed = false) {
        const user = await UserService.findOne(userId);
        const article = await ArticleModel.findById(articleId)
            .populate([
                { path: "tags", select: ["name"] },
                { path: "createdBy", select: ["name", "surname"] },
                { path: "verifiedBy", select: ["name", "surname", "isActive"] },
                { path: "product", select: ["name", "labelColor", "banner"] },
            ])
            .where({ isTrashed: findTrashed });

        appAssert(article, NOT_FOUND, "Article not found");

        const isFavourite = user.favourites.some((f) => f._id.equals(article._id));

        return {
            ...article.toObject(),
            isFavourite,
        };
    },
    async findByUser(userId: string, { startDate, endDate }: { startDate?: string; endDate?: string }) {
        const query: any = { createdBy: userId };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        return ArticleModel.find(query)
            .populate("product", "name")
            .populate("category", "name")
            .sort({ createdAt: -1 });
    },

    async findOneHistory(articleId: string) {
        const articleWithHistory = await getArticleHistory({ articleId });
        return articleWithHistory;
    },

    async findHistoryOne(articleHistoryId: string) {
        const historyItem = await ArticleHistoryModel.findById(articleHistoryId).populate("updatedBy", "name surname");

        if (!historyItem) {
            throw Error("Historia nie znaleziona");
        }

        const updatedChanges = await Promise.all(
            historyItem.changes.map(async (change) => {
                if (change.field === "tags") {
                    const oldTags = await TagModel.find({ _id: { $in: JSON.parse(change.oldValue || "[]") } }).select(
                        "name"
                    );
                    const newTags = await TagModel.find({ _id: { $in: JSON.parse(change.newValue || "[]") } }).select(
                        "name"
                    );

                    return {
                        ...change.toObject(),
                        oldValue: oldTags.map((tag) => tag.name),
                        newValue: newTags.map((tag) => tag.name),
                    };
                }
                return change;
            })
        );

        return {
            ...historyItem.toObject(),
            changes: updatedChanges,
        };
    },

    async toggleVerify(userId: string, articleId: string, isVerified: any) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        const isVerifiedChanged = article.isVerified !== isVerified;
        article.isVerified = isVerified;
        const updatedAritlce = await article.save();
        const updatedAritlceObj = updatedAritlce.toObject();

        if (isVerifiedChanged) {
            await saveArticleChanges({
                articleId: articleId,
                articleBeforeChanges: article, // Artykuł przed zmianą
                updatedArticle: updatedAritlceObj, // Artykuł po zmianie
                updatedBy: userId,
                eventType: isVerified ? EventType.verified : EventType.Unverified,
            });
        }
    },

    async toggleFavourite(userId: string, articleId: string) {
        const user = await UserModel.findById({ _id: userId });
        appAssert(user, NOT_FOUND, "User not found");

        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        const isFavourite = user.favourites.includes(article._id);

        if (isFavourite) {
            user.favourites = user.favourites.filter((favoriteId) => favoriteId.toString() !== article._id.toString());
        } else {
            user.favourites.push(article._id);
        }

        await UserModel.findByIdAndUpdate(userId, { favourites: user.favourites });

        return isFavourite;
    },

    async updateOneAsTrash(userId: string, articleId: string) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        article.isTrashed = true;
        const trashedArticle = await article.save();

        const updatedAritlceObj = trashedArticle.toObject();

        if (updatedAritlceObj.isTrashed) {
            await saveArticleChanges({
                articleId: articleId,
                articleBeforeChanges: article,
                updatedArticle: updatedAritlceObj,
                updatedBy: userId,
                eventType: EventType.Trashed,
            });
        }
    },

    async updateOneAsRestore(userId: string, articleId: string) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        article.isTrashed = false;
        const restoredArticle = await article.save();

        const updatedAritlceObj = restoredArticle.toObject();

        if (!updatedAritlceObj.isTrashed) {
            await saveArticleChanges({
                articleId: articleId,
                articleBeforeChanges: article,
                updatedArticle: updatedAritlceObj,
                updatedBy: userId,
                eventType: EventType.Restored,
            });
        }
    },

    async deleteOne(articleId: string) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: articleId });
        appAssert(deletedArticle, INTERNAL_SERVER_ERROR, "Something went wrong");

        await ArticleHistoryModel.deleteMany({ articleId: articleId });
    },

    async updateOne(userId: string, articleId: string, body: any) {
        const { title, clientDescription, employeeDescription, tags, product, category } = body;

        const article = await ArticleModel.findById({ _id: articleId });

        appAssert(article, NOT_FOUND, "Article not found");

        const articleBeforeChanges = article.toObject();

        article.title = title || article.title;
        article.clientDescription = clientDescription || article.clientDescription;
        article.employeeDescription = employeeDescription || article.employeeDescription;
        article.tags = tags || article.tags;
        article.product = product || article.product;
        article.category = category || article.category;

        const updatedArticle = await article.save();
        const updatedArticleObject = updatedArticle.toObject();

        await saveArticleChanges({
            articleId: articleId,
            updatedBy: userId,
            articleBeforeChanges,
            updatedArticle: updatedArticleObject,
            eventType: EventType.Updated,
        });
    },

    async findCreatedByUser(userId: string, query: any) {
        const { startDate, endDate } = query;

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
                filter.createdAt.$gte = new Date(startDate.toString());
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate.toString());
            }
        }

        const userArticles = await ArticleModel.find(filter).select(["title", "createdAt", "isVerified"]);
        return userArticles;
    },

    async findHistoryByUser(userId: string, query: any) {
        const { startDate, endDate } = query;

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
            articleId: { $ne: null },
        };

        if (startDate || endDate) {
            filter.updatedAt = {};
            if (startDate) {
                filter.updatedAt.$gte = new Date(startDate.toString());
            }
            if (endDate) {
                filter.updatedAt.$lte = new Date(endDate.toString());
            }
        }

        const userHistory = await ArticleHistoryModel.find(filter)
            .populate({
                path: "articleId",
                select: ["title", "isTrashed"],
                match: { isTrashed: false },
            })
            .populate({
                path: "updatedBy",
                select: "name surname",
            })
            .exec();

        const userHistoryFiltered = userHistory.filter((entry) => entry.articleId);
        return userHistoryFiltered;
    },
};
