import { CREATED, NO_CONTENT, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { UsefulLinkService } from "./usefulLink.service";

export const UsefulLinkController = (usefulLinkService = UsefulLinkService) => ({
    create: catchErrors(async ({ params, body }, res) => {
        const { usefulLinkId } = params;
        const payload = body;
        await usefulLinkService.create(payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params, query }, res) => {
        const payload = query;
        const usefulLinks = await usefulLinkService.find(payload);
        return res.status(OK).json(usefulLinks);
    }),
    findOne: catchErrors(async ({ params, query }, res) => {
        const { usefulLinkId } = params;

        const usefulLink = await usefulLinkService.findOne(usefulLinkId);
        return res.status(OK).json(usefulLink);
    }),

    deleteOne: catchErrors(async ({ params, query }, res) => {
        const { usefulLinkId } = params;

        await usefulLinkService.deleteOne(usefulLinkId);
        return res.sendStatus(NO_CONTENT);
    }),
});
