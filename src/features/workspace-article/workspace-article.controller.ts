import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { objectIdParam } from "../../common/dto/params-id.dto";
import { createWorkspaceArticleDto } from "./dto/create-workspace-article.dto";
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
});
