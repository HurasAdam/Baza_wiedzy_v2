import { Types } from "mongoose";
import CategoryModel from "../category/category.model";
import ProductModel from "../product/product.model";
import TagModel from "../tag/tag.model";
import ArticleHistoryModel from "./article-history.model";

export enum ArticleEventType {
    Created = "created",
    Updated = "updated",
    Trashed = "trashed",
    Restored = "restored",
    Verified = "verified",
    Unverified = "unverified",
    StatusChanged = "statusChanged",
}

export interface Change {
    field: string;
    oldValue: any;
    newValue: any;
}

interface SaveChangesParams {
    articleId: string;
    before?: any;
    after: any;
    userId: string;
    eventType: ArticleEventType | string;
    statusChange?: {
        from: "pending" | "approved" | "rejected" | "draft";
        to: "pending" | "approved" | "rejected" | "draft";
    };
}

export const ArticleHistoryService = {
    async saveChanges({ articleId, before, after, userId, eventType, statusChange }: SaveChangesParams) {
        const changes: Change[] = [];

        // fallback dla statusChange
        const finalStatusChange = statusChange ?? { from: before?.status ?? after.status, to: after.status };

        if (eventType === ArticleEventType.Created) {
            await ArticleHistoryModel.create({
                articleId: new Types.ObjectId(articleId),
                createdBy: new Types.ObjectId(userId),
                eventType,
                changes: [
                    {
                        field: "all",
                        oldValue: null,
                        newValue: after,
                    },
                ],
                statusChange: finalStatusChange,
                updatedAt: new Date(),
            });
            return;
        }

        if (eventType === ArticleEventType.Verified) {
            await ArticleHistoryModel.create({
                articleId: new Types.ObjectId(articleId),
                createdBy: new Types.ObjectId(userId),
                eventType,
                changes: [
                    {
                        field: "isVerified",
                        oldValue: before?.isVerified ?? false,
                        newValue: true,
                    },
                    {
                        field: "status",
                        oldValue: before?.status,
                        newValue: after.status,
                    },
                ],
                statusChange: finalStatusChange,
                updatedAt: new Date(),
            });
            return;
        }

        if (eventType === ArticleEventType.Unverified) {
            await ArticleHistoryModel.create({
                articleId: new Types.ObjectId(articleId),
                createdBy: new Types.ObjectId(userId),
                eventType,
                changes: [
                    {
                        field: "isVerified",
                        oldValue: before?.isVerified ?? true,
                        newValue: false,
                    },
                ],
                statusChange: finalStatusChange,
                updatedAt: new Date(),
            });
            return;
        }

        if (eventType === ArticleEventType.Updated && before) {
            // TITLE
            if (before.title !== after.title) {
                changes.push({ field: "title", oldValue: before.title, newValue: after.title });
            }

            // DESCRIPTION
            if (before.employeeDescription !== after.employeeDescription) {
                changes.push({
                    field: "employeeDescription",
                    oldValue: before.employeeDescription,
                    newValue: after.employeeDescription,
                });
            }

            // STATUS
            if (before.status !== after.status) {
                changes.push({ field: "status", oldValue: before.status, newValue: after.status });
            }

            // IS VERIFIED
            if (before.isVerified !== after.isVerified) {
                changes.push({ field: "isVerified", oldValue: before.isVerified, newValue: after.isVerified });
            }

            // TAGS
            if (JSON.stringify(before.tags) !== JSON.stringify(after.tags)) {
                const oldTags = await TagModel.find({ _id: { $in: before.tags || [] } }).select("name");
                const newTags = await TagModel.find({ _id: { $in: after.tags || [] } }).select("name");

                changes.push({
                    field: "tags",
                    oldValue: oldTags.map((t) => ({ id: t._id, name: t.name })),
                    newValue: newTags.map((t) => ({ id: t._id, name: t.name })),
                });
            }

            // PRODUCT
            if (String(before.product) !== String(after.product)) {
                const oldProduct = before.product ? await ProductModel.findById(before.product).select("name") : null;
                const newProduct = after.product ? await ProductModel.findById(after.product).select("name") : null;

                changes.push({
                    field: "product",
                    oldValue: oldProduct ? { id: oldProduct._id, name: oldProduct.name } : null,
                    newValue: newProduct ? { id: newProduct._id, name: newProduct.name } : null,
                });
            }

            // CATEGORY
            if (String(before.category) !== String(after.category)) {
                const oldCategory = before.category
                    ? await CategoryModel.findById(before.category).select("name")
                    : null;
                const newCategory = after.category ? await CategoryModel.findById(after.category).select("name") : null;

                changes.push({
                    field: "category",
                    oldValue: oldCategory ? { id: oldCategory._id, name: oldCategory.name } : null,
                    newValue: newCategory ? { id: newCategory._id, name: newCategory.name } : null,
                });
            }

            // RESPONSE VARIANTS – snapshot całości
            if (JSON.stringify(before.responseVariants) !== JSON.stringify(after.responseVariants)) {
                changes.push({
                    field: "responseVariants",
                    oldValue: before.responseVariants,
                    newValue: after.responseVariants,
                });
            }
        }

        // jeśli nic się realnie nie zmieniło, nie zapisujemy historii
        if (changes.length === 0) return;

        await ArticleHistoryModel.create({
            articleId: new Types.ObjectId(articleId),
            createdBy: new Types.ObjectId(userId),
            eventType,
            changes,
            statusChange: finalStatusChange,
            updatedAt: new Date(),
        });
    },
    async findHistoryByArticle(articleId: string) {
        return ArticleHistoryModel.find({ articleId }).populate("createdBy", "name surname").sort({ createdAt: -1 });
    },
    async findHistoryItemDetails(historyItemId: string) {
        return ArticleHistoryModel.findOne({ _id: historyItemId })
            .populate("createdBy", "name surname")
            .sort({ createdAt: -1 });
    },
};
