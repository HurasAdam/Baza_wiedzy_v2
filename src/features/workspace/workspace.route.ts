import { Router } from "express";
import { WorkspaceController } from "./workspace.controller";

export const workspaceRoutes = Router();
const workspaceController = WorkspaceController();

//prefix: /workspaces

workspaceRoutes.get("/", workspaceController.find);
workspaceRoutes.get("/:workspaceId", workspaceController.findOne);

workspaceRoutes.delete("/:workspaceId", workspaceController.deleteWorkspace);
workspaceRoutes.get("/:workspaceId/members", workspaceController.findMembers);

workspaceRoutes.delete("/:workspaceId/members/:memberId", workspaceController.removeMember);
workspaceRoutes.post("/", workspaceController.create);
workspaceRoutes.patch("/:workspaceId", workspaceController.updateOne);

workspaceRoutes.post("/join", workspaceController.joinByInviteCode);
