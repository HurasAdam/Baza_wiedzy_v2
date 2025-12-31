import { objectIdParam } from "../../common/dto/params-id.dto";
import { CREATED, NO_CONTENT, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { ArticleUserFlagService } from "./article-user-flag.service";

export const ArticleUserFlagController = (articleUserFlagService = ArticleUserFlagService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const serviceResponse = await articleUserFlagService.create(userId, body);
        return res.status(CREATED).json({ message: "OK" });
    }),

    findOne: catchErrors(async ({ userId, params }, res) => {
        const { articleId } = objectIdParam("articleId").parse(params);

        const serviceResponse = await articleUserFlagService.findOne(articleId, userId);
        return res.status(OK).json(serviceResponse);
    }),
    unflagOne: catchErrors(async ({ userId, params }, res) => {
        const { articleId } = params;
        const serviceResponse = await articleUserFlagService.unflagOne(articleId, userId);
        return res.status(OK).json(serviceResponse);
    }),

    updateFlag: catchErrors(async ({ userId, params, body }, res) => {
        const { articleId } = objectIdParam("articleId").parse(params);
        const { flagId } = body;
        await articleUserFlagService.updateFlag(articleId, userId, flagId);
        return res.sendStatus(NO_CONTENT);
    }),
});
