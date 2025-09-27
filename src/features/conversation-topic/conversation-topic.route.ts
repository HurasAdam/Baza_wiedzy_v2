import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { ConversationTopicController } from "./conversation-topic.controller";

export const conversationTopicRoutes = Router();
export const conversationTopicController = ConversationTopicController();

// prefix /conversation-topics

conversationTopicRoutes.get("/", conversationTopicController.find);
conversationTopicRoutes.get("/:id", conversationTopicController.findOne);
conversationTopicRoutes.post("/", permissionGuard(Permissions.ADD_TOPIC), conversationTopicController.create);
conversationTopicRoutes.put("/:id", permissionGuard(Permissions.EDIT_TOPIC), conversationTopicController.updateOne);
conversationTopicRoutes.delete("/:id", conversationTopicController.deleteOne);
