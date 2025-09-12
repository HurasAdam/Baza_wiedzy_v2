import CategoryModel from "@/features/category/category.model";
import ProductModel from "@/features/product/product.model";
import TagModel from "@/features/tag/tag.model";
import { Types } from "mongoose";
import ArticleHistoryModel from "./article-history.model";

export enum ArticleEventType {
    Created = "created",
    Updated = "updated",
    Trashed = "trashed",
    Restored = "restored",
    Verified = "verified",
    Unverified = "unverified",
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
    eventType: ArticleEventType;
}

export const ArticleHistoryService = {
    async saveChanges({ articleId, before, after, userId, eventType }: SaveChangesParams) {
        const changes: Change[] = [];

        if (eventType === ArticleEventType.Created) {
            await ArticleHistoryModel.create({
                articleId: new Types.ObjectId(articleId),
                createdBy: new Types.ObjectId(userId),
                eventType,
                changes: [
                    {
                        field: "all",
                        oldValue: null,
                        newValue: after, // snapshot całego artykułu
                    },
                ],
                updatedAt: new Date(),
            });
            return;
        }

        if (eventType === ArticleEventType.Updated && before) {
            for (const key of ["title", "employeeDescription", "status"]) {
                if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
                    changes.push({
                        field: key,
                        oldValue: before[key],
                        newValue: after[key],
                    });
                }
            }

            // tags
            if (JSON.stringify(before.tags) !== JSON.stringify(after.tags)) {
                const oldTags = await TagModel.find({ _id: { $in: before.tags || [] } }).select("name");
                const newTags = await TagModel.find({ _id: { $in: after.tags || [] } }).select("name");

                changes.push({
                    field: "tags",
                    oldValue: oldTags.map((t) => ({ id: t._id, name: t.name })),
                    newValue: newTags.map((t) => ({ id: t._id, name: t.name })),
                });
            }

            // product
            if (String(before.product) !== String(after.product)) {
                const oldProduct = before.product ? await ProductModel.findById(before.product).select("name") : null;
                const newProduct = after.product ? await ProductModel.findById(after.product).select("name") : null;

                changes.push({
                    field: "product",
                    oldValue: oldProduct ? { id: oldProduct._id, name: oldProduct.name } : null,
                    newValue: newProduct ? { id: newProduct._id, name: newProduct.name } : null,
                });
            }

            // category
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
        }

        if (changes.length === 0 && eventType === ArticleEventType.Updated) return;

        await ArticleHistoryModel.create({
            articleId: new Types.ObjectId(articleId),
            createdBy: new Types.ObjectId(userId),
            eventType,
            changes,
            updatedAt: new Date(),
        });
    },

    async findHistoryByArticle(articleId: string) {
        return ArticleHistoryModel.find({ articleId }).populate("createdBy", "name surname").sort({ createdAt: -1 });
    },
};
