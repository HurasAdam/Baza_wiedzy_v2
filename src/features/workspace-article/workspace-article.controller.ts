import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
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
});
