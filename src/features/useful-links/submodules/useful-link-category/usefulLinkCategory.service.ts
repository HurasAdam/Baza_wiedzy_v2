import { CONFLICT } from "../../../../constants/http";
import appAssert from "../../../../utils/appAssert";
import { usefulLinkCategoryModel } from "./usefulLinkCategory.model";

export const UsefulLinkCategoryService = {
    async create(payload: { name: string }) {
        const existingUsefulLinkFolder = await usefulLinkCategoryModel.findOne({
            name: payload.name,
        });
        appAssert(!existingUsefulLinkFolder, CONFLICT, "folder with this name already exists");
        return await usefulLinkCategoryModel.create({
            name: payload.name,
        });
    },
    async find(payload: unknown) {
        const usefulLinkCategories = await usefulLinkCategoryModel.find({});
        return usefulLinkCategories;
    },
    async findOne(folderId: string) {},
};
