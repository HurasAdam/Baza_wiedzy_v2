import { objectIdParam } from "../../common/dto/params-id.dto";
import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { createWorkspaceDto } from "./dto/create-workspace.dto";
import { workspaceMembersDto } from "./dto/workspaceMembers.dto";
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

    findOne: catchErrors(async ({ userId, params }, res) => {
        const { workspaceId } = objectIdParam("workspaceId").parse(params);
        const userWorkspaces = await workspaceService.findOne(userId, workspaceId);
        return res.status(OK).json(userWorkspaces);
    }),
    findMembers: catchErrors(async ({ params }, res) => {
        const { workspaceId } = params;
        const members = await workspaceService.findMembers(workspaceId);
        const formattedMembers = workspaceMembersDto(members);
        return res.status(OK).json(formattedMembers);
    }),
    updateOne: catchErrors(async ({ userId, params, body }, res) => {
        const { workspaceId } = objectIdParam("workspaceId").parse(params);
        const payload = createWorkspaceDto.parse(body);
        const updated = await workspaceService.updateOne(userId, workspaceId, payload);
        return res.status(OK).json({ message: "Zaktualizowano workspace", data: updated });
    }),
});
