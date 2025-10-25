import { CREATED } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { ArticleUserFlagService } from "./article-user-flag.service";

export const ArticleUserFlagController = (articleUserFlagService = ArticleUserFlagService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const serviceResponse = await articleUserFlagService.create(userId, body);
        return res.status(CREATED).json({ message: "OK" });
    }),

    findOne: catchErrors(async ({ userId, params }, res) => {
        const { articleId } = params;
        const serviceResponse = await articleUserFlagService.findOne(articleId, userId);
        return res.status(200).json(serviceResponse);
    }),
    unflagOne: catchErrors(async ({ userId, params }, res) => {
        const { articleId } = params;
        const serviceResponse = await articleUserFlagService.unflagOne(articleId, userId);
        return res.status(200).json(serviceResponse);
    }),
});
