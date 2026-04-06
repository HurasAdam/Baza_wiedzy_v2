import { Router } from "express";
import { PinnedWorkspaceController } from "./pinned-workspace.controller";

export const pinnedWorkspaceRoutes = Router();
const pinnedLinkController = PinnedWorkspaceController();

// prefix /pinned-workspaces

pinnedWorkspaceRoutes.post("/", pinnedLinkController.create);
pinnedWorkspaceRoutes.delete("/:workspaceId", pinnedLinkController.delete);

pinnedWorkspaceRoutes.get("/", pinnedLinkController.find);
