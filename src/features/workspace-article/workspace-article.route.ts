import { Router } from "express";

import { WorkspaceArticleController } from "./workspace-article.controller";

export const workspaceArticleRoutes = Router();
const workspaceArticleController = WorkspaceArticleController();

// prefix /workspace-articles

workspaceArticleRoutes.post("/", workspaceArticleController.create);
workspaceArticleRoutes.get("/folder/:folderId", workspaceArticleController.findByFolder);
