import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import { constructSearchQuery } from "@/utils/constructSearchQuery";
import mongoose, { Types } from "mongoose";
import { io } from "../../main";
import ArticleHistoryModel from "../article-history/article-history.model";
import { ArticleEventType, ArticleHistoryService } from "../article-history/article-history.service";
import { NotificationService } from "../notification/notofication.service";
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
            followers: [userId],
        });

        // responseVariants
        const createdVariants = await Promise.all(
            payload.responseVariants.map((variant) =>
                ResponseVariantModel.create({
                    ...variant,
                    createdBy: userId,
                    articleId: newArticle._id,
                })
            )
        );

        const populatedArticle = await ArticleModel.findById(newArticle._id)
            .populate("tags", "name")
            .populate("product", "name")
            .populate("category", "name")
            .populate("createdBy", "name surname")
            .select("-_id")
            .lean();

        // SNAPSHOT
        const afterSnapshot = {
            ...populatedArticle,
            responseVariants: createdVariants.map((v) => ({
                id: v._id,
                variantName: v.variantName,
                variantContent: v.variantContent,
            })),
        };

        await ArticleHistoryService.saveChanges({
            articleId: newArticle._id.toString(),
            before: null,
            after: afterSnapshot,
            userId,
            eventType: ArticleEventType.Created,
        });

        await NotificationService.broadcastNotification({
            permissions: ["APPROVE_ARTICLE"],
            title: "Dodano nowy artykuł",
            message: `Dodano nowy artykuł: ${payload.title}`,
            link: `/articles/${newArticle._id}`,
            type: "info",
        });

        io.emit("new-notification", { type: "article_created", articleId: newArticle._id });
        return newArticle;
    },

    async follow(userId: string, articleId: string) {
        const article = await ArticleModel.findById({ _id: articleId });
        appAssert(article, NOT_FOUND, "Article not found");
        const alreadyFollowing = article.followers.some((followerId) => followerId.toString() === userId);
        appAssert(!alreadyFollowing, BAD_REQUEST, "User already follows this article");

        await ArticleModel.findByIdAndUpdate(articleId, { $addToSet: { followers: userId } }, { new: true });
    },
    async unfollow(userId: string, articleId: string) {
        const article = await ArticleModel.findById(articleId);
        appAssert(article, NOT_FOUND, "Article not found");

        const isFollowing = article.followers.some((followerId) => followerId.toString() === userId);
        appAssert(isFollowing, BAD_REQUEST, "User does not follow this article");

        await ArticleModel.findByIdAndUpdate(articleId, { $pull: { followers: userId } }, { new: true });
    },

    async find(userId: string, query: SearchArticlesDto, findTrashed = false) {
        const { limit, page, sortBy, sortAt, title } = query;
        const skip = (page - 1) * limit;
        const baseProjection = ["-clientDescription", "-employeeDescription", "-verifiedBy", "-updatedAt", "-__v"];

        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        let keyword = title?.trim() || "";
        let searchInContent = query.searchInContent || false;

        const starPattern = /\*([^*]+)\*/g;
        const matches = [...keyword.matchAll(starPattern)].map((m) => m[1].trim());
        if (matches.length > 0) {
            searchInContent = true;
        }

        const titleForQuery = searchInContent ? undefined : keyword;
        const constructed = constructSearchQuery({ ...query, title: titleForQuery });
        const querydb = { ...constructed, isTrashed: findTrashed };

        if (searchInContent && (matches.length > 0 || keyword.length > 0)) {
            let matchedArticleIds: any[] = [];

            if (matches.length > 0) {
                const regexArray = matches.map((m) => new RegExp(escapeRegex(m), "i"));
                const conditions = regexArray.map((regex) => ({ variantContent: regex }));

                matchedArticleIds = await ResponseVariantModel.distinct("articleId", { $and: conditions });
            } else {
                const cleanKeyword = keyword.replace(/\*/g, "").trim();
                const regex = new RegExp(escapeRegex(cleanKeyword), "i");
                matchedArticleIds = await ResponseVariantModel.distinct("articleId", { variantContent: regex });
            }

            const MAX_IDS = 5000;
            if (matchedArticleIds.length > MAX_IDS) matchedArticleIds = matchedArticleIds.slice(0, MAX_IDS);

            if (matchedArticleIds.length === 0) {
                return { data: [], pagination: { total: 0, page, pages: 0 } };
            }

            const articleObjectIds = matchedArticleIds.map((id) => new Types.ObjectId(String(id)));
            const articleQuery = { ...querydb, _id: { $in: articleObjectIds } };

            const articles = await ArticleModel.find(articleQuery)
                .select(baseProjection)
                .populate([
                    { path: "tags", select: ["name", "shortname"] },
                    { path: "createdBy", select: ["name", "surname"] },
                    { path: "product", select: ["name", "labelColor", "banner"] },
                    { path: "category", select: ["name"] },
                ])
                .skip(skip)
                .limit(limit)
                .sort([[sortBy, sortAt]])
                .exec();

            const total = await ArticleModel.countDocuments(articleQuery);
            const { favourites } = await UserService.findOne(userId);

            const articlesWithExtras = await Promise.all(
                articles.map(async (article) => {
                    const articleObj = article.toObject();
                    const isFavourite = favourites.some((favId) => favId.equals(article._id));
                    const responseVariantsCount = await ResponseVariantModel.countDocuments({ articleId: article._id });
                    return { ...articleObj, isFavourite, responseVariantsCount };
                })
            );

            return {
                data: articlesWithExtras,
                pagination: { total, page, pages: Math.ceil(total / limit) },
            };
        }

        if (keyword.length > 0) {
            querydb.title = new RegExp(escapeRegex(keyword), "i");
        }

        const articles = await ArticleModel.find(querydb)
            .select(baseProjection)
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
                const responseVariantsCount = await ResponseVariantModel.countDocuments({ articleId: article._id });
                return { ...articleObj, isFavourite, responseVariantsCount };
            })
        );

        return {
            data: articlesWithExtras,
            pagination: { total, page, pages: Math.ceil(total / limit) },
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

        await NotificationService.broadcastNotification({
            permissions: ["READ_ONLY"],
            title: "Dodano nowy artykuł",
            message: `Dodano nowy artykuł: ${article.title}`,
            link: `/articles/${article._id}`,
            type: "info",
        });
        io.emit("new-notification", { type: "article_created", articleId: article._id });
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

        await NotificationService.notifyArticleAuthor({
            articleId: article._id.toString(),
            title: "Twój artykuł został odrzucony",
            message: `Artykuł "${article.title}" wymaga naniesienia zmian.`,
            link: `/articles/${article._id}`,
            type: "info",
        });
        io.emit("new-notification", { type: "article_created", articleId: article._id });
    },

    async requestReviewOne(userId: string, articleId: string) {
        const article = await ArticleModel.findById(articleId);
        appAssert(article, NOT_FOUND, "Article not found");

        // sprawdź czy jest w statusie rejected
        appAssert(article.status === "rejected", CONFLICT, "Only rejected articles can be resubmitted");

        // zmiana statusu
        article.status = "draft";
        article.rejectionReason = null; // możesz też czyścić powód, bo już nie jest aktualny
        article.rejectedBy = null;

        const updatedArticle = await article.save();

        await NotificationService.broadcastNotification({
            permissions: ["APPROVE_ARTICLE"],
            title: "Artykuł przesłany do ponownej weryfikacji",
            message: `Artykuł "${updatedArticle.title}" został poprawiony i oczekuje na weryfikację.`,
            link: `/articles/${updatedArticle._id}`,
            type: "info",
        });
        io.emit("new-notification", { type: "article_created", articleId: updatedArticle._id });
        return updatedArticle.toObject();
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

    async updateOne(userId: string, articleId: string, body: any, options: { simpleEdit: boolean }) {
        const { title, employeeDescription, tags, product, category, responseVariants } = body;

        const article = await ArticleModel.findById(articleId);
        appAssert(article, NOT_FOUND, "Article not found");

        // 2. Pobierz warianty przed zmianą
        const beforeVariants = await ResponseVariantModel.find({ articleId })
            .select("_id version variantName variantContent")
            .lean();

        // 3. Złóż snapshot "before"
        const beforeArticle = {
            ...(article.toObject() as any),
            responseVariants: beforeVariants,
        };

        article.title = title ?? article.title;
        article.employeeDescription = employeeDescription ?? article.employeeDescription;
        article.tags = tags ?? article.tags;
        article.product = product ?? article.product;
        article.category = category ?? article.category;

        if (!options.simpleEdit) {
            if (article.status === "rejected") {
                article.status = "draft";
            } else if (article.status === "approved") {
                article.status = "pending";
            } else {
                article.status = "pending";
            }
        }

        await article.save();

        if (Array.isArray(responseVariants)) {
            // getting response varriants linked to current Article
            const existingVariants = await ResponseVariantModel.find({ articleId });

            // converting array into map
            const existingMap = new Map(existingVariants.map((v) => [v._id.toString(), v]));

            const incomingIds = responseVariants.filter((v: any) => v._id).map((v: any) => v._id);

            // 1. Update
            for (const variant of responseVariants) {
                if (variant._id && existingMap.has(variant._id)) {
                    // Update istniejącego
                    await ResponseVariantModel.findByIdAndUpdate(variant._id, {
                        version: variant.version,
                        variantName: variant.variantName,
                        variantContent: variant.variantContent,
                        modifiedBy: userId,
                        modifiedAt: new Date(),
                    });
                } else {
                    // Adding new varaints
                    const newVariant = new ResponseVariantModel({
                        articleId,
                        version: variant.version,
                        variantName: variant.variantName,
                        variantContent: variant.variantContent,
                        createdBy: userId,
                    });
                    await newVariant.save();
                }
            }

            // 2. Removing variants
            for (const existing of existingVariants) {
                if (!incomingIds.includes(existing._id.toString())) {
                    await ResponseVariantModel.findByIdAndDelete(existing._id);
                }
            }
        }

        // 6. Pobierz warianty po zmianie
        const afterVariants = await ResponseVariantModel.find({ articleId })
            .select("_id version variantName variantContent")
            .lean();

        // 7. Złóż snapshot "after"
        const afterArticle = {
            ...(article.toObject() as any),
            responseVariants: afterVariants,
        };

        await ArticleHistoryService.saveChanges({
            articleId,
            before: beforeArticle,
            after: afterArticle,
            userId,
            eventType: ArticleEventType.Updated,
            statusChange: { from: beforeArticle.status, to: afterArticle.status },
        });

        return article.toObject();
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
