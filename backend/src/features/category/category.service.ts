import { NOT_FOUND } from "@/constants/http";
import CategoryModel from "./category.model";
import appAssert from "@/utils/appAssert";
import ArticleModel from "../article/article.model";
import type { SearchCategoriesDto } from "./dto/search-categories.dto";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import ProductModel from "../product/product.model";

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
    async findByProduct(productId: string, query: SearchCategoriesDto) {
        const { limit, page, sortAt, sortBy, name } = query;
        const skip = (page - 1) * limit;

        const filter: any = { productId };
        if (name?.trim()) {
            filter.name = new RegExp(name.trim(), "i");
        }

        return await CategoryModel.find(filter)
            .limit(limit)
            .skip(skip)
            .sort([[sortBy, sortAt]]);
    },

    async create(userId: string, payload: CreateCategoryDto, productId: string) {
        const product = await ProductModel.findById(productId);
        appAssert(product, NOT_FOUND, "Product not found");

        const existingCategory = await CategoryModel.findOne({
            name: payload.name.trim(),
            productId,
        });
        appAssert(!existingCategory, 409, "Category with this name already exists for this product");

        return await CategoryModel.create({
            ...payload,
            createdBy: userId,
            productId,
            updatedBy: userId,
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
