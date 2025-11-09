import { Router } from "express";
import { WorkspaceController } from "./workspace.controller";

export const workspaceRoutes = Router();
const workspaceController = WorkspaceController();

//prefix: /workspaces

workspaceRoutes.get("/", workspaceController.find);
workspaceRoutes.get("/:workspaceId", workspaceController.findOne);
workspaceRoutes.post("/", workspaceController.create);
