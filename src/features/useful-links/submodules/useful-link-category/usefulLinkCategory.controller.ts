import { CREATED, OK } from "../../../../constants/http";
import catchErrors from "../../../../utils/catchErrors";
import { UsefulLinkCategoryService } from "./usefulLinkCategory.service";

export const UsefulLinkCategoryController = (usefulLinkCategoryService = UsefulLinkCategoryService) => ({
    create: catchErrors(async ({ body }, res) => {
        const payload = body;
        await usefulLinkCategoryService.create(payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params, query }, res) => {
        const payload = query;
        const usefulLinks = await usefulLinkCategoryService.find(payload);
        return res.status(OK).json(usefulLinks);
    }),
    findOne: catchErrors(async ({ params, query }, res) => {
        const { usefulLinkId } = params;

        const usefulLink = await usefulLinkCategoryService.findOne(usefulLinkId);
        return res.status(OK).json(usefulLink);
    }),
});
