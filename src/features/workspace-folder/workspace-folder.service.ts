import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceModel from "../workspace/workspace.model";
import { CreateWorkspaceFolderDto } from "./dto/create-workspaceFolder.dto";
import { WorkspaceFolderModel } from "./workspace-folder.model";

export const WorkspaceFolderService = {
    async create(userId: string, workspaceId: string, body: CreateWorkspaceFolderDto) {
        const { name } = body;

        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Nie znaleziono workspace");

        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId });
        appAssert(isMember, FORBIDDEN, "Brak dostępu do tego workspace");

        const existingFolder = await WorkspaceFolderModel.findOne({ workspaceId, name });
        appAssert(!existingFolder, CONFLICT, "Folder o tej nazwie już istnieje");

        const folder = await WorkspaceFolderModel.create({
            workspaceId,
            name,
            createdBy: userId,
        });

        return folder;
    },
    async findFolders(userId: string, workspaceId: string) {
        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId });
        appAssert(isMember, FORBIDDEN, "Brak dostępu do tego workspace");

        const folders = await WorkspaceFolderModel.find({ workspaceId }).lean();
        return folders;
    },
};
