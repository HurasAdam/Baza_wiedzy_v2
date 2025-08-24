import { CREATED, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { ArticleViewService } from "./articleView.service";
import { articleViewsFilterDto } from "./dto/search-popular-articles.dto";

export const ArticleViewController = (articleViewService = ArticleViewService) => ({
    create: catchErrors(async ({ userId, params }, res) => {
        const { id } = params;
        await articleViewService.create(id, userId);
        return res.sendStatus(CREATED);
    }),
    findPopular: catchErrors(async ({ query }, res) => {
        const { startDate, endDate, userId, limit } = articleViewsFilterDto.parse(query);
        const data = await articleViewService.findPopular({ startDate, endDate, userId, limit });
        return res.status(OK).json(data);
    }),
});
