import { WorkspaceRoles } from "../../enums/workspaceRole.enum";
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
        // TODO -- extend User model with currentWorkspace field --
        // user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        return workspace;
    },
};
