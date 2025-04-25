import { NOT_FOUND } from "@/constants/http";
import CategoryModel from "./category.model";
import appAssert from "@/utils/appAssert";
import ArticleModel from "../article/article.model";
import type { SearchCategoriesDto } from "./dto/search-categories.dto";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

export const CategoryService = {
    async find(query: SearchCategoriesDto) {
        const { limit, page, sortAt, sortBy } = query;
        const skip = (page - 1) * limit;

        return await CategoryModel.find()
            .limit(limit)
            .skip(skip)
            .sort([[sortBy, sortAt]]);
    },

    async findOne(id: string) {
        const category = await CategoryModel.findById(id);
        appAssert(category, NOT_FOUND, "Category not found");

        return category;
    },

    async create(userId: string, payload: CreateCategoryDto) {
        return await CategoryModel.create({
            ...payload,
            createdBy: userId,
        });
    },

    async updateOne(userId: string, categoryId: string, payload: UpdateCategoryDto) {
        const category = await CategoryModel.findByIdAndUpdate(categoryId, {
            ...payload,
            updatedBy: userId,
        });
        appAssert(category, NOT_FOUND, "Category not found");
    },

    async deleteOne(categoryId: string) {
        const countArticles = await ArticleModel.countDocuments({ category: categoryId });

        if (countArticles > 0) {
            throw Error("Kategoria jest używana i nie można jej usunąć");
        }

        await CategoryModel.findByIdAndDelete(categoryId);
    },
};
