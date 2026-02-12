import { CREATED, OK } from "../../../../constants/http";
import catchErrors from "../../../../utils/catchErrors";
import { UsefulLinkFolderService } from "./usefulLinkFolder.service";

export const UsefulLinkFolderController = (usefulLinkFolderService = UsefulLinkFolderService) => ({
    create: catchErrors(async ({ params, body }, res) => {
        const { usefulLinkId } = params;
        const payload = body;
        await usefulLinkFolderService.create(payload);
        return res.sendStatus(CREATED);
    }),

    find: catchErrors(async ({ params, query }, res) => {
        const payload = query;
        const usefulLinks = await usefulLinkFolderService.find(payload);
        return res.status(OK).json(usefulLinks);
    }),
    findOne: catchErrors(async ({ params, query }, res) => {
        const { usefulLinkId } = params;

        const usefulLink = await usefulLinkFolderService.findOne(usefulLinkId);
        return res.status(OK).json(usefulLink);
    }),
});
