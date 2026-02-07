import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { WorkspaceResponseVariantModel } from "../workspace-article/response-variant/workspace-response-variant.model";
import { WorkspaceArticleModel } from "../workspace-article/workspace-article.model";
import { WorkspaceFolderModel } from "../workspace-folder/workspace-folder.model";
import WorkspaceMemberModel, {
    defaultPermissions,
    WorkspacePermissions,
} from "../workspace-member/workspaceMember.model";
import WorkspaceRoleModel from "../workspace-role/workspace-role.model";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import WorkspaceModel from "./workspace.model";

export const WorkspaceService = {
    async create(userId: string, payload: CreateWorkspaceDto) {
        const workspace = await WorkspaceModel.create({
            ...payload,
            owner: userId,
        });

        const allPermissions: WorkspacePermissions = {
            addFolder: true,
            editFolder: true,
            deleteFolder: true,
            addArticle: true,
            editArticle: true,
            deleteArticle: true,
            addMember: true,
            removeMember: true,
            editWorkspace: true,
        };

        const workspaceMember = new WorkspaceMemberModel({
            userId,
            workspaceId: workspace._id,
            joinedAt: new Date(),
            permissions: allPermissions,
        });

        await workspaceMember.save();

        return workspace;
    },
    async find(userId: string) {
        const memberships = await WorkspaceMemberModel.find({ userId }).populate("workspaceId");

        const workspaces = memberships.map((member) => member.workspaceId).filter((ws) => ws !== null);

        return workspaces;
    },
    async findOne(userId: string, workspaceId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId });
        const isOwner = workspace.owner?.toString() === userId.toString();

        appAssert(isMember || isOwner, FORBIDDEN, "Nie masz dostępu do tego workspace");

        if (!isOwner) {
            workspace.inviteCode = "";
        }

        return workspace;
    },
    async findMembers(workspaceId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const members = await WorkspaceMemberModel.find({ workspaceId })
            .populate({
                path: "userId",
                select: "name surname email",
            })

            .lean();

        return members.map((member) => ({
            ...member,
            isOwner: member.userId._id.toString() === workspace.owner.toString(),
        }));
    },
    async updateOne(userId: string, workspaceId: string, payload: CreateWorkspaceDto) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace not found");

        const isOwner = workspace.owner.toString() === userId;

        appAssert(isOwner, FORBIDDEN, "You do not have sufficient permissions to perform this action");

        Object.assign(workspace, payload);
        await workspace.save();

        return workspace;
    },

    async joinByInviteCode(userId: string, inviteCode: string) {
        const workspace = await WorkspaceModel.findOne({ inviteCode });
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId: workspace._id });
        if (isMember) {
            throw appAssert(false, CONFLICT, "Już należysz do tej kolekcji");
        }

        const memberRole = await WorkspaceRoleModel.findOne({ name: "VIEWER" });

        appAssert(memberRole, NOT_FOUND, "Role MEMBER nie istnieje");

        const newMember = new WorkspaceMemberModel({
            userId,
            workspaceId: workspace._id,
            role: memberRole._id,
            joinedAt: new Date(),
        });

        await newMember.save();
        return { workspaceId: workspace._id, workspaceName: workspace.name };
    },

    async removeMember(userId: string, workspaceId: string, memberId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Kolekcja nie istnieje");

        const isOwner = workspace.owner.toString() === userId;

        appAssert(isOwner, FORBIDDEN, "Nie masz uprawnień do usunięcia użytkownika z tej kolekcji");

        const memberToRemove = await WorkspaceMemberModel.findById(memberId);
        appAssert(
            memberToRemove && memberToRemove.workspaceId.toString() === workspaceId,
            NOT_FOUND,
            "Użytkownik nie należy do wybranej kolekcji"
        );

        appAssert(memberToRemove.userId.toString() !== userId, FORBIDDEN, "Brak uprawnień do wykonania tej operacji");

        await WorkspaceMemberModel.deleteOne({ _id: memberId });

        return;
    },

    async deleteWorkspace(userId: string, workspaceId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Kolekcja nie istnieje");

        const isOwner = workspace.owner.toString() === userId;
        appAssert(isOwner, FORBIDDEN, "Nie masz uprawnień do usunięcia tej kolekcji");

        await WorkspaceMemberModel.deleteMany({ workspaceId });

        const folders = await WorkspaceFolderModel.find({ workspaceId }).select("_id");

        const folderIds = folders.map((f) => f._id);

        const articles = await WorkspaceArticleModel.find({ folderId: { $in: folderIds } }).select("_id");
        const articleIds = articles.map((a) => a._id);

        await WorkspaceResponseVariantModel.deleteMany({ articleId: { $in: articleIds } });

        await WorkspaceArticleModel.deleteMany({ _id: { $in: articleIds } });

        await WorkspaceFolderModel.deleteMany({ _id: { $in: folderIds } });

        await WorkspaceModel.deleteOne({ _id: workspaceId });

        return true;
    },

    async changeOwner(userId: string, workspaceId: string, memberDocId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const isOwner = workspace.owner.toString() === userId;
        appAssert(isOwner, FORBIDDEN, "Nie masz uprawnień do zmiany właściciela");

        const newOwnerMember = await WorkspaceMemberModel.findById(memberDocId);
        appAssert(newOwnerMember, NOT_FOUND, "Wybrany członek nie istnieje");

        appAssert(
            newOwnerMember.workspaceId.toString() === workspaceId,
            FORBIDDEN,
            "Członek nie należy do tego workspace"
        );

        const oldOwnerId = workspace.owner.toString();
        workspace.owner = newOwnerMember.userId;
        await workspace.save();

        newOwnerMember.permissions = {
            addFolder: true,
            editFolder: true,
            deleteFolder: true,
            addArticle: true,
            editArticle: true,
            deleteArticle: true,
            addMember: true,
            removeMember: true,
            editWorkspace: true,
        };
        await newOwnerMember.save();

        const oldOwnerMember = await WorkspaceMemberModel.findOne({ workspaceId, userId: oldOwnerId });
        if (oldOwnerMember) {
            oldOwnerMember.permissions = defaultPermissions;
            await oldOwnerMember.save();
        }
    },
};
