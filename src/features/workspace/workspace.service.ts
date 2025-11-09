import { FORBIDDEN, NOT_FOUND } from "../../constants/http";
import { WorkspaceRoles } from "../../enums/workspaceRole.enum";
import appAssert from "../../utils/appAssert";
import { WorkspaceFolderModel } from "../workspace-folder/workspace-folder.model";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceRoleModel from "../workspace-role/workspace-role.model";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import WorkspaceModel from "./workspace.model";

export const WorkspaceService = {
    async create(userId: string, payload: CreateWorkspaceDto) {
        const onwerRole = await WorkspaceRoleModel.findOne({ name: WorkspaceRoles.OWNER });

        if (!onwerRole) {
            throw new Error("Owner role not found");
        }
        const workspace = await WorkspaceModel.create({
            ...payload,
            owner: userId,
        });

        const workspaceMember = new WorkspaceMemberModel({
            userId,
            workspaceId: workspace._id,
            role: onwerRole._id,
            joinedAt: new Date(),
        });

        await workspaceMember.save();
        // TODO -- extend User model with currentWorkspace field --
        // user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        return workspace;
    },
    async find(userId: string) {
        const memberships = await WorkspaceMemberModel.find({ userId }).populate("workspaceId");

        const workspaces = memberships.map((member) => member.workspaceId).filter((ws) => ws !== null);

        return workspaces;
    },
    async findOne(userId: string, workspaceId: string) {
        const isMember =
            (await WorkspaceMemberModel.exists({ userId, workspaceId })) ||
            (await WorkspaceModel.exists({ _id: workspaceId, owner: userId }));

        appAssert(isMember, FORBIDDEN, "Nie masz dostępu do tego workspace");

        const workspace = await WorkspaceModel.findById(workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const folders = await WorkspaceFolderModel.find({ workspaceId }).lean();

        return {
            ...workspace,
            folders,
        };
    },
};
