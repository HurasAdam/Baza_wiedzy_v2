import PinnedWorkspaceModel from "./pinned-workspace.model";

export const PinnedWorkspaceService = {
    async create(userId: string, payload: string) {
        await PinnedWorkspaceModel.create({
            owner: userId,
            workspace: payload,
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
