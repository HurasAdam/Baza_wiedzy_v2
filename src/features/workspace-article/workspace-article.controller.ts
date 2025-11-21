import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { objectIdParam } from "../../common/dto/params-id.dto";
import { createWorkspaceArticleDto } from "./dto/create-workspace-article.dto";
import { updateWorkspaceArticleDto } from "./dto/update-workspace-article.dto";
import { workspaceArticleResponseVariantDto } from "./dto/workspace-article-response-variant.dto";
import { WorkspaceArticleService } from "./workspace-article.service";

export const WorkspaceArticleController = (workspaceArticleService = WorkspaceArticleService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createWorkspaceArticleDto.parse(body);
        const article = await workspaceArticleService.create(userId, payload);
        return res.status(OK).json({ message: "Dodano nowy artykuł", data: article });
    }),
    findByFolder: catchErrors(async ({ params, query }, res) => {
        const { folderId } = params;
        const data = await workspaceArticleService.findByFolder(folderId, query);
        return res.status(OK).json(data);
    }),

    findOne: catchErrors(async ({ params, userId }, res) => {
        const { articleId } = objectIdParam("articleId").parse(params);
        const article = await workspaceArticleService.findOne(userId, articleId);

        return res.status(OK).json(article);
    }),
    createResponseVariant: catchErrors(async ({ params, body, userId }, res) => {
        const { articleId } = params;

        const payload = workspaceArticleResponseVariantDto.parse(body);

        const updatedVariant = await workspaceArticleService.createResponseVariant(
            userId,
            articleId,

            payload
        );

        return res.status(OK).json({ message: "Wariant odpowiedzi został zaktualizowany", data: updatedVariant });
    }),

    updateResponseVariant: catchErrors(async ({ params, body, userId }, res) => {
        const { articleId, variantId } = params;

        const payload = workspaceArticleResponseVariantDto.parse(body);

        const updatedVariant = await workspaceArticleService.updateResponseVariant(
            userId,
            articleId,
            variantId,
            payload
        );

        return res.status(OK).json({ message: "Wariant odpowiedzi został zaktualizowany", data: updatedVariant });
    }),

    updateOne: catchErrors(async ({ params, body, userId }, res) => {
        const { articleId } = objectIdParam("articleId").parse(params);
        const payload = updateWorkspaceArticleDto.parse(body);
        const updatedVariant = await workspaceArticleService.updateOne(
            userId,
            articleId,

            payload
        );

        return res.status(OK).json(updatedVariant);
    }),
});
