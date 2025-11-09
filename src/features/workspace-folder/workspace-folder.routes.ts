import { Router } from "express";
import { WorkspaceFolderController } from "./workspace-folder.controller";

export const workspaceFolderRoutes = Router();
const workspaceFolderController = WorkspaceFolderController();

// prefix: /workspace-folders

// workspaceFolderRoutes.get("/:workspaceId", workspaceFolderController.find);
workspaceFolderRoutes.post("/:workspaceId", workspaceFolderController.create);
workspaceFolderRoutes.get("/:workspaceId/folders", workspaceFolderController.findFolders);
workspaceFolderRoutes.get("/:workspaceId/folders/:folderId", workspaceFolderController.findOneFolder);
