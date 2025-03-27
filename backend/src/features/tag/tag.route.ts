import { Router } from "express";

import { TagController } from "./tag.controller";
import preventDeleteDefaultTag from "../../middleware/preventDeleteDefaultTag";

export const tagRoutes = Router();
const tagController = TagController();

// prefix /tags

tagRoutes.get("/", tagController.getTags);
tagRoutes.get("/:id", tagController.getSingleTag);
tagRoutes.post("/", tagController.createTag);
tagRoutes.put("/:id", tagController.updateTag);
tagRoutes.delete("/:id", preventDeleteDefaultTag, tagController.deleteTag);
