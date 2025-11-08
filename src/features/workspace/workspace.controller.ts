import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { createWorkspaceDto } from "./dto/create-workspace.dto";
import { WorkspaceService } from "./workspace.service";

export const WorkspaceController = (workspaceService = WorkspaceService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createWorkspaceDto.parse(body);
        const workspace = await workspaceService.create(userId, payload);
        return res.status(OK).json({ message: "Dodano nową kolekcję", data: workspace });
    }),
    find: catchErrors(async ({ userId }, res) => {
        const userWorkspaces = await workspaceService.find(userId);
        return res.status(OK).json(userWorkspaces);
    }),
});
