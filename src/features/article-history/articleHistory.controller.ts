import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { z } from "zod";
import { ArticleHistoryService } from "./article-history.service";
import { articleHistoryListResponseDto } from "./dto/response-dto/article-history-list-response.dto";

export const ArticleHistoryController = (articleHistoryService = ArticleHistoryService) => ({
    findHistoryByArticle: catchErrors(async ({ userId, params, query }, res) => {
        const { articleId } = params;
        const serviceResponse = await articleHistoryService.findHistoryByArticle(articleId);
        console.log(serviceResponse);
        const response = z.array(articleHistoryListResponseDto).parse(serviceResponse);
        console.log("FULL HISTORY:", JSON.stringify(serviceResponse, null, 2));

        return res.status(OK).json(response);
    }),
    findOneHistoryItem: catchErrors(async ({ userId, query }, res) => {
        return res.status(OK).json("articles");
    }),
    findHistoryByUser: catchErrors(async ({ userId, query }, res) => {
        return res.status(OK).json("articles");
    }),
});
