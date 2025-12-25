import { FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceModel from "../workspace/workspace.model";
import { UpdateWorkspaceMemberPermissionsDto } from "./dto/update-workspace-member-permissions.dto";

export const WorkspaceMemberService = {
    async updatePermissions(currentUserId: string, memberId: string, payload: UpdateWorkspaceMemberPermissionsDto) {
        const member = await WorkspaceMemberModel.findById(memberId);
        appAssert(member, NOT_FOUND, "Workspace member not found");

        const workspace = await WorkspaceModel.findById(member.workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace not found");

        const isOwner = workspace.owner.toString() === currentUserId;

        appAssert(isOwner, FORBIDDEN, "You do not have sufficient permissions to perform this action");

        member.permissions = {
            ...member.permissions,
            ...payload.permissions,
        };

        await member.save();
        return member;
    },

    async deleteMember(currentUserId: string, memberId: string) {
        const member = await WorkspaceMemberModel.findById(memberId);
        appAssert(member, NOT_FOUND, "Workspace member not found");

        const workspace = await WorkspaceModel.findById(member.workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace not found");

        const currentUserMember = await WorkspaceMemberModel.findOne({
            userId: currentUserId,
            workspaceId: member.workspaceId,
        }).populate("role");

        const isOwner = workspace.owner.toString() === currentUserId;

        appAssert(isOwner, FORBIDDEN, "You do not have sufficient permissions to perform this action");

        await member.deleteOne();
        return;
    },
};
