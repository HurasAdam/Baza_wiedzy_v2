import { Router } from "express";

import { TagController } from "./tag.controller";
import preventDeleteDefaultTag from "../../middleware/preventDeleteDefaultTag";

export const tagRoutes = Router();
const tagController = TagController();

// prefix /tags

tagRoutes.get("/", tagController.getTags);
tagRoutes.get("/tag/:id", tagController.getSingleTag);
tagRoutes.post("/create", tagController.createTag);
tagRoutes.put("/tag/:id/update", tagController.updateTag);
tagRoutes.delete("/tag/:id/delete", preventDeleteDefaultTag, tagController.deleteTag);
