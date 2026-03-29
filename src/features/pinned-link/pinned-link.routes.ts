import { Router } from "express";
import { PinnedLinkController } from "./pinned-link.controller";

export const pinnedLinkRoutes = Router();
const pinnedLinkController = PinnedLinkController();

// prefix /pinned-links
pinnedLinkRoutes.delete("/:pinnedLinkId", pinnedLinkController.deleteOne);
pinnedLinkRoutes.post("/", pinnedLinkController.create);
pinnedLinkRoutes.get("/:pinnedLinkId", pinnedLinkController.findOne);
pinnedLinkRoutes.get("/", pinnedLinkController.find);
pinnedLinkRoutes.patch("/:pinnedLinkId", pinnedLinkController.updateOne);
