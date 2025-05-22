import { NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { ArticleService } from "./article.service";
import { createArticleDto } from "./dto/create-article.dto";
import { searchArticlesDto } from "./dto/search-articles.dto";

export const ArticleController = (articleService = ArticleService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createArticleDto.parse(body);
        const article = await articleService.create(userId, payload);
        return res.status(OK).json({ message: "Dodano nowy artykuł", data: article });
    }),

    find: catchErrors(async ({ userId, query }, res) => {
        const payload = searchArticlesDto.parse(query);
        const articles = await articleService.find(userId, payload);
        return res.status(OK).json(articles);
    }),

    findTrashed: catchErrors(async ({ userId, query }, res) => {
        const payload = searchArticlesDto.parse(query);
        const articles = await articleService.find(userId, payload, true);
        return res.status(OK).json(articles);
    }),

    findOne: catchErrors(async ({ userId, params }, res) => {
        const article = await articleService.findOne(userId, params.id);
        return res.status(OK).json(article);
    }),
    findByUser: catchErrors(async ({ params, query }, res) => {
        const { id } = params;
        const articles = await articleService.findByUser(id, query);
        return res.status(200).json(articles);
    }),

    findOneTrashed: catchErrors(async ({ userId, params }, res) => {
        const article = await articleService.findOne(userId, params.id, true);
        return res.status(OK).json(article);
    }),

    findOneHistory: catchErrors(async ({ params }, res) => {
        const articleWithHistory = await articleService.findOneHistory(params.id);
        return res.status(OK).json(articleWithHistory);
    }),

    findHistoryOne: catchErrors(async ({ params }, res) => {
        const history = await articleService.findHistoryOne(params.id);
        return res.status(OK).json(history);
    }),

    toggleVerify: catchErrors(async ({ userId, body, params }, res) => {
        await articleService.toggleVerify(userId, params.id, body.isVerified);
        return res.status(OK).json({
            message: body.isVerified ? "Artykuł został zweryfikowany" : "Artykuł został oznaczony jako do weryfikacji",
        });
    }),

    toggleFavourite: catchErrors(async ({ userId, params }, res) => {
        const isFavourite = await articleService.toggleFavourite(userId, params.id);
        return res.status(OK).json({
            message: `${isFavourite ? "Usunięto artykuł z listy ulubionych" : " Dodano artkuł do listy ulubionych"}`,
        });
    }),

    updateOneAsTrash: catchErrors(async ({ userId, params }, res) => {
        await articleService.updateOneAsTrash(userId, params.id);
        res.sendStatus(NO_CONTENT);
    }),

    updateOneAsRestore: catchErrors(async ({ userId, params }, res) => {
        await articleService.updateOneAsRestore(userId, params.id);
        res.sendStatus(NO_CONTENT);
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        await articleService.deleteOne(params.id);
        res.sendStatus(NO_CONTENT);
    }),

    updateOne: catchErrors(async ({ userId, params, body }, res) => {
        await articleService.updateOne(userId, params.id, body);
        res.status(OK).json({ message: "Artykuł został zaktualizowany" });
    }),

    findCreatedByUser: catchErrors(async ({ params, query }, res) => {
        const userArticles = await articleService.findCreatedByUser(params.id, query);
        return res.status(OK).json(userArticles);
    }),

    findHistoryByUser: catchErrors(async ({ params, query }, res) => {
        const history = await articleService.findHistoryByUser(params.id, query);
        return res.status(OK).json(history);
    }),
});
