import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceModel from "../workspace/workspace.model";
import PinnedWorkspaceModel from "./pinned-workspace.model";

export const PinnedWorkspaceService = {
    async create(userId: string, workspaceId: string) {
        const workspaceExists = await WorkspaceModel.exists({ _id: workspaceId });

        appAssert(workspaceExists, NOT_FOUND, "Workspace not found");

        const membership = await WorkspaceMemberModel.exists({
            userId,
            workspaceId,
        });

        appAssert(membership, FORBIDDEN, "You are not member of this workspace");
        console.log("CZY jest memberem", membership);

        const alreadyPinned = await PinnedWorkspaceModel.exists({
            owner: userId,
            workspace: workspaceId,
        });

        appAssert(!alreadyPinned, CONFLICT, "Workspace already pinned");

        await PinnedWorkspaceModel.create({
            owner: userId,
            workspace: workspaceId,
        });
    },
    async find(userId: string) {
        const pinnedWorkspaces = await PinnedWorkspaceModel.find({ owner: userId }).populate([
            { path: "workspace", select: ["name", "icon", "labelColor"] },
        ]);
        return pinnedWorkspaces;
    },

    async delete(userId: string, workspaceId: string) {
        await PinnedWorkspaceModel.findOneAndDelete({ workspace: workspaceId, owner: userId });
    },
};
