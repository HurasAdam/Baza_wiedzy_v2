import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { constructSearchQuery } from "@/utils/constructSearchQuery";
import mongoose from "mongoose";
import ArticleHistoryModel from "../article-history/article-history.model";
import { ArticleEventType, ArticleHistoryService } from "../article-history/article-history.service";
import TagModel from "../tag/tag.model";
import UserModel from "../user/user.model";
import { UserService } from "../user/user.service";
import ArticleModel from "./article.model";
import type { CreateArticleDto } from "./dto/create-article.dto";
import type { SearchArticlesDto } from "./dto/search-articles.dto";
import ResponseVariantModel from "./responseVariant/responseVariant.model";

export const ArticleService = {
    async create(userId: string, payload: CreateArticleDto) {
        const articleExists = await ArticleModel.exists({ title: payload.title });
        appAssert(!articleExists, CONFLICT, "Article already exists");

        const newArticle = await ArticleModel.create({
            ...payload,
            createdBy: userId,
            verifiedBy: userId,
        });

        // Create response varaint/variants based on form data and link them to created Article
        await Promise.all(
            payload.responseVariants.map((variant) =>
                ResponseVariantModel.create({
                    ...variant,
                    createdBy: userId,
                    articleId: newArticle._id,
                })
            )
        );

        // --- historia: event created ---
        await ArticleHistoryService.saveChanges({
            articleId: newArticle._id.toString(),
            before: null,
            after: newArticle.toObject(),
            userId,
            eventType: ArticleEventType.Created, // pojedynczy event
        });

        return newArticle;
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

        const articlesWithExtras = await Promise.all(
            articles.map(async (article) => {
                const articleObj = article.toObject();

                const isFavourite = favourites.some((favId) => favId.equals(article._id));

                const responseVariantsCount = await ResponseVariantModel.countDocuments({
                    articleId: article._id,
                });

                return {
                    ...articleObj,
                    isFavourite,
                    responseVariantsCount,
                };
            })
        );

        return {
            data: articlesWithExtras,
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
                { path: "category", select: ["name"] },
            ])
            .where({ isTrashed: findTrashed });

        appAssert(article, NOT_FOUND, "Article not found");
        const responseVariants = await ResponseVariantModel.find({ articleId: article._id }).lean();
        const isFavourite = user.favourites.some((f) => f._id.equals(article._id));

        return {
            ...article.toObject(),
            responseVariants,
            isFavourite,
        };
    },
    async findByUser(userId: string, { startDate, endDate }: { startDate?: string; endDate?: string }) {
        const query: any = { createdBy: userId };

        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        return ArticleModel.find(query)
            .populate("product", "name")
            .populate("category", "name")
            .sort({ createdAt: -1 });
    },

    async findOneHistory(articleId: string) {
        const articleWithHistory = await ArticleHistoryService.findHistoryByArticle(articleId);
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
    },

    async aproveOne(userId: string, articleId: string) {
        const article = await ArticleModel.findById(articleId);
        appAssert(article, NOT_FOUND, "Article not found");

        // snapshot BEFORE changes
        const articleBeforeChangesObj = article.toObject();

        // apply changes
        article.status = "approved";
        article.isVerified = true;
        article.rejectionReason = null;
        article.rejectedBy = null;
        article.verifiedBy = new mongoose.Types.ObjectId(userId);

        // save
        const updatedArticle = await article.save();
        const updatedArticleObj = updatedArticle.toObject();

        // save history event
        await ArticleHistoryService.saveChanges({
            articleId,
            before: articleBeforeChangesObj,
            after: updatedArticleObj,
            userId,
            eventType: ArticleEventType.Verified,
        });

        return updatedArticle;
    },

    async rejectOne(userId: string, articleId: string, rejectionReason: string) {
        const article = await ArticleModel.findById(articleId);
        appAssert(article, NOT_FOUND, "Article not found");

        const isPending = article.status === "draft";
        appAssert(isPending, NOT_FOUND, "Article status must be 'draft' to reject");

        article.status = "rejected";
        article.rejectionReason = rejectionReason;
        article.rejectedBy = new mongoose.Types.ObjectId(userId);
        await article.save();
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
    },

    async updateOneAsRestore(userId: string, articleId: string) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        article.isTrashed = false;
        const restoredArticle = await article.save();

        const updatedAritlceObj = restoredArticle.toObject();
    },

    async deleteOne(articleId: string) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");

        const deletedArticle = await ArticleModel.findByIdAndDelete({ _id: articleId });
        appAssert(deletedArticle, INTERNAL_SERVER_ERROR, "Something went wrong");

        await ArticleHistoryModel.deleteMany({ articleId: articleId });
    },

    async updateOne(userId: string, articleId: string, body: any, options?: { simpleEdit?: boolean }) {
        const article = await ArticleModel.findById(articleId);
        appAssert(article, NOT_FOUND, "Article not found");

        const oldArticle = article.toObject();
        const oldStatus = article.status as "draft" | "pending" | "approved" | "rejected";

        article.title = body.title ?? article.title;
        article.employeeDescription = body.employeeDescription ?? article.employeeDescription;
        article.tags = body.tags ?? article.tags;
        article.product = body.product ?? article.product;
        article.category = body.category ?? article.category;

        if (!options?.simpleEdit) {
            if (article.status === "rejected") {
                article.status = "draft";
            } else if (article.status === "approved") {
                article.status = "pending";
            }
        }

        await article.save();
        const newArticle = article.toObject();
        const newStatus = newArticle.status as "draft" | "pending" | "approved" | "rejected";

        // --- zapis historii ---
        let statusChange: { from: typeof oldStatus; to: typeof newStatus } | undefined;

        if (oldStatus !== newStatus) {
            statusChange = { from: oldStatus, to: newStatus };
        }

        await ArticleHistoryService.saveChanges({
            articleId,
            before: oldArticle,
            after: newArticle,
            userId,
            eventType: ArticleEventType.Updated,
            statusChange,
        });

        return newArticle;
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

    async findAllByUser(userId: string, query: SearchArticlesDto) {
        const querydb = {
            createdBy: userId,
            ...constructSearchQuery(query),
            isTrashed: false,
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
                { path: "rejectedBy", select: ["name", "surname"] },
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
};
