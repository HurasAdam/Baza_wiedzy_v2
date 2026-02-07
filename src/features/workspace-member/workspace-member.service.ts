import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import UserModel from "../user/user.model";
import WorkspaceMemberModel, { defaultPermissions } from "../workspace-member/workspaceMember.model";
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
    async findCurrentWorkspaceMember(userId: string, workspaceId: string) {
        const member = await WorkspaceMemberModel.findOne({ userId, workspaceId }).lean();
        appAssert(member, NOT_FOUND, "User is not a member of this workspace");

        const workspace = await WorkspaceModel.findById(workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace not found");

        const isOwner = workspace.owner.toString() === userId.toString();

        return { ...member, isOwner };
    },
    async findInviteCandidates(currentUserId: string, workspaceId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace not found");

        // Find current workspace members
        const existingMembers = await WorkspaceMemberModel.find({ workspaceId }).select("userId");

        const existingUserIds = existingMembers.map((m) => m.userId.toString());

        existingUserIds.push(workspace.owner.toString());

        // Find users that are not workspace members yet

        const candidates = await UserModel.find({
            _id: { $nin: existingUserIds },
        })
            .select("email name surname")
            .lean();

        return candidates;
    },

    async addMember(currentUserId: string, workspaceId: string, newUserId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace not found");

        const isOwner = workspace.owner.toString() === currentUserId;

        const currentMember = await WorkspaceMemberModel.findOne({
            workspaceId,
            userId: currentUserId,
        });

        const hasPermission = isOwner || (currentMember && currentMember.permissions?.addMember === true);

        appAssert(hasPermission, FORBIDDEN, "You do not have permission to add members to this workspace");

        const existingMember = await WorkspaceMemberModel.findOne({
            workspaceId,
            userId: newUserId,
        });

        appAssert(!existingMember, CONFLICT, "User is already a member of this workspace");

        const newMember = await WorkspaceMemberModel.create({
            workspaceId,
            userId: newUserId,
            permissions: defaultPermissions,
        });

        return newMember;
    },
};
