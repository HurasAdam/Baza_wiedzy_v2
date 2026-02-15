import { CONFLICT, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { usefulLinkCategoryModel } from "./submodules/useful-link-category/usefulLinkCategory.model";
import UsefulLinkModel from "./usefulLink.model";

export const UsefulLinkService = {
    async create(payload: {
        name: string;
        url: string;
        description: string;
        linkCategory: string;
        isFeatured: boolean;
    }) {
        const { name, url, description, linkCategory, isFeatured } = payload;
        const usefulLinkCategory = await usefulLinkCategoryModel.exists({ _id: linkCategory });

        appAssert(usefulLinkCategory, NOT_FOUND, "Link category not found");

        const existingLink = await UsefulLinkModel.exists({ name });
        appAssert(!existingLink, CONFLICT, "link name already taken");

        return await UsefulLinkModel.create({
            ...payload,
        });
    },
    async find(payload: unknown) {
        const usefulLinks = await UsefulLinkModel.find().populate({ path: "linkCategory", select: "name" }).lean(); // opcjonalnie, jeśli chcesz zwykłe JS

        return usefulLinks;
    },
    async findOne(usefulLinkId: string) {},

    async deleteOne(usefulLinkId: string) {
        const usefulLink = await UsefulLinkModel.findById({ _id: usefulLinkId });
        appAssert(usefulLink, NOT_FOUND, "Link not found");
        await usefulLink.deleteOne({ _id: usefulLinkId });
    },
};
