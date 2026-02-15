import { Router } from "express";
import { UsefulLinkController } from "./usefulLink.controller";
export const usefulLinkRoutes = Router();
const usefulLinkController = UsefulLinkController();

// prefix /useful-links

usefulLinkRoutes.get("/", usefulLinkController.find);
usefulLinkRoutes.get("/:usefulLinkId", usefulLinkController.findOne);
usefulLinkRoutes.post("/", usefulLinkController.create);
usefulLinkRoutes.delete("/:usefulLinkId", usefulLinkController.deleteOne);
