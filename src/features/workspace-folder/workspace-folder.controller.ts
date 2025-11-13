import { objectIdParam } from "../../common/dto/params-id.dto";
import { CREATED, OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import { createWorkspaceFolderDto } from "./dto/create-workspaceFolder.dto";
import { WorkspaceFolderService } from "./workspace-folder.service";

export const WorkspaceFolderController = (workspaceFolderService = WorkspaceFolderService) => ({
    create: catchErrors(async ({ userId, body, params }, res) => {
        const { workspaceId } = params;
        const payload = createWorkspaceFolderDto.parse(body);
        const folder = await workspaceFolderService.create(userId, workspaceId, payload);
        return res.status(CREATED).json({ message: "Dodano nowy folder", data: folder });
    }),
    findFolders: catchErrors(async ({ userId, body, params }, res) => {
        const { workspaceId } = params;
        const folders = await WorkspaceFolderService.findFolders(userId, workspaceId);
        return res.status(OK).json(folders);
    }),
    findOneFolder: catchErrors(async ({ userId, body, params }, res) => {
        const { workspaceId, folderId } = params;
        const folder = await WorkspaceFolderService.findOneFolder(userId, workspaceId, folderId);
        return res.status(OK).json(folder);
    }),
    updateOneFolder: catchErrors(async ({ userId, body, params }, res) => {
        const payload = createWorkspaceFolderDto.parse(body);
        const { workspaceId } = objectIdParam("workspaceId").parse(params);
        const { folderId } = objectIdParam("folderId").parse(params);
        const folder = await WorkspaceFolderService.updateOneFolder(userId, workspaceId, folderId, payload);
        return res.status(OK).json(folder);
    }),
});
