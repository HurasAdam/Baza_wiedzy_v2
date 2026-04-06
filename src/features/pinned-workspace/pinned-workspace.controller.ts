import { CREATED, NO_CONTENT, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { PinnedWorkspaceService } from "./pinned-workspace.service";

export const PinnedWorkspaceController = (service = PinnedWorkspaceService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const { workspace } = body;
        await service.create(userId, workspace);
        return res.sendStatus(CREATED);
    }),
    find: catchErrors(async ({ userId }, res) => {
        const serviceResponse = await service.find(userId);
        res.status(OK).json(serviceResponse);
    }),
    delete: catchErrors(async ({ userId, params }, res) => {
        const { workspaceId } = params;
        await service.delete(userId, workspaceId);
        res.sendStatus(NO_CONTENT);
    }),
});
