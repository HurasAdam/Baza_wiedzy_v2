import { Router } from "express";
import defaultTagMiddleware from "./middleware/default-tag.middleware";
import { TagController } from "./tag.controller";

export const tagRoutes = Router();
const tagController = TagController();

// prefix /tags

tagRoutes.get("/", tagController.find);
tagRoutes.get("/:id", tagController.findOne);
tagRoutes.post("/", tagController.create);
tagRoutes.put("/:id", tagController.updateOne);
tagRoutes.delete("/:id", defaultTagMiddleware, tagController.deleteOne);
