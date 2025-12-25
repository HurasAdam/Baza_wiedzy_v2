import { Router } from "express";
import { WorkspaceMemberController } from "./workspace-member.controller";

export const workspaceMemberRoutes = Router();
const workspaceMemberController = WorkspaceMemberController();

// prefix: /workspace-members

// PATCH /workspace-members/:memberId/permissions
workspaceMemberRoutes.patch("/:memberId/permissions", workspaceMemberController.updatePermissions);
