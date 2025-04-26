import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { searchCategoriesDto } from "./dto/search-categories.dto";
import { createCategoryDto } from "./dto/create-category.dto";
import { updateCategoryDto } from "./dto/update-category.dto";
import { CategoryService } from "./category.service";

export const CategoryController = (categoryService = CategoryService) => ({
    find: catchErrors(async ({ query }, res) => {
        const payload = searchCategoriesDto.parse(query);
        const result = await categoryService.find(payload);
        res.status(OK).json(result);
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const category = await categoryService.findOne(params.id);
        return res.status(OK).json(category);
    }),
    findByProduct: catchErrors(async ({ params, query }, res) => {
        const payload = searchCategoriesDto.parse(query);
        const categories = await categoryService.findByProduct(params.id, payload);
        return res.status(OK).json(categories);
    }),
    create: catchErrors(async ({ userId, body, params }, res) => {
        const payload = createCategoryDto.parse(body);
        const category = await categoryService.create(userId, payload, params.id);
        return res.status(OK).json(category);
    }),

    updateOne: catchErrors(async ({ user, params, body }, res) => {
        const payload = updateCategoryDto.parse(body);
        await categoryService.updateOne(user.id, params.id, payload);
        res.status(OK).json({ message: "Kategoria została zaktualizowana" });
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        await categoryService.deleteOne(params.id);
        res.status(OK).json({ message: "Kategoria została usunięta" });
    }),
});
