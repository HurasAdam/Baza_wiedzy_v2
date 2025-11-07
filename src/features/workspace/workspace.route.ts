import { Router } from "express";
import { WorkspaceController } from "./workspace.controller";

export const workspaceRoutes = Router();
const workspaceController = WorkspaceController();

//prefix: /workspaces

workspaceRoutes.post("/", workspaceController.create);
