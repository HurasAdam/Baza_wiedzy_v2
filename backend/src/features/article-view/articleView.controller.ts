import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { ArticleViewService } from "./articleView.service";

export const ArticleViewController = (articleViewService = ArticleViewService) => ({
    create: catchErrors(async ({ userId, params }, res) => {
        // const payload = createArticleDto.parse(body);
        const { id } = params;
        await articleViewService.create(id, userId);
        // return res.status(OK).json({ message: "Dodano nowy artykuł", data: article });

        return res.status(OK).json("DZIAŁA OK");
    }),
});
