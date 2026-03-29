import { CREATED, NO_CONTENT, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { PinnedLinkService } from "./pinned-link.service";

export const PinnedLinkController = (pinnedLinkService = PinnedLinkService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = body;
        await pinnedLinkService.create(payload, userId);
        return res.sendStatus(CREATED);
    }),
    find: catchErrors(async ({ userId }, res) => {
        const serviceResponse = await pinnedLinkService.find(userId);
        return res.status(OK).json(serviceResponse);
    }),
    findOne: catchErrors(async ({ userId, params }, res) => {
        const { pinnedLinkId } = params;
        const serviceResponse = await pinnedLinkService.findOne(pinnedLinkId);

        console.log(pinnedLinkId);
        return res.status(OK).json(serviceResponse);
    }),
    updateOne: catchErrors(async ({ userId, params, body }, res) => {
        const { pinnedLinkId } = params;
        const payload = body;

        await pinnedLinkService.updateOne(userId, pinnedLinkId, payload);
        return res.sendStatus(NO_CONTENT);
    }),

    deleteOne: catchErrors(async ({ userId, params }, res) => {
        const { pinnedLinkId } = params;
        await pinnedLinkService.deleteOne(userId, pinnedLinkId);
        return res.sendStatus(NO_CONTENT);
    }),
});
