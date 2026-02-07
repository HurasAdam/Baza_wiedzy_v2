import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { objectIdParam } from "../../common/dto/params-id.dto";

import { addWorkspaceMemberDto } from "./dto/add-workspace-member.dto";
import { updateWorkspaceMemberPermissionsDto } from "./dto/update-workspace-member-permissions.dto";
import { WorkspaceMemberService } from "./workspace-member.service";

export const WorkspaceMemberController = (
    workspaceMemberService: typeof WorkspaceMemberService = WorkspaceMemberService
) => ({
    updatePermissions: catchErrors(async ({ params, body, userId }, res) => {
        const { memberId } = objectIdParam("memberId").parse(params);

        const payload = updateWorkspaceMemberPermissionsDto.parse(body);

        await workspaceMemberService.updatePermissions(userId, memberId, payload);

        return res.status(OK).json({ message: "Permissions updated" });
    }),

    findCurrentWorkspaceMember: catchErrors(async ({ params, userId }, res) => {
        const { workspaceId } = objectIdParam("workspaceId").parse(params);

        const serviceResponse = await workspaceMemberService.findCurrentWorkspaceMember(userId, workspaceId);
        return res.status(OK).json(serviceResponse);
    }),

    findInviteCandidates: catchErrors(async ({ params, userId }, res) => {
        const { workspaceId } = objectIdParam("workspaceId").parse(params);

        const candidates = await workspaceMemberService.findInviteCandidates(userId, workspaceId);

        return res.status(OK).json(candidates);
    }),

    addMember: catchErrors(async ({ params, body, userId }, res) => {
        const { workspaceId } = objectIdParam("workspaceId").parse(params);

        const payload = addWorkspaceMemberDto.parse(body);

        const member = await workspaceMemberService.addMember(userId, workspaceId, payload.userId);

        return res.status(201).json(member);
    }),
});
