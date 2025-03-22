import { Router } from "express";
import { ConversationTopicController } from "./conversation-topic.controller";

export const conversationTopicRoutes = Router();
export const conversationTopicController = ConversationTopicController();

// prefix /conversation-topics

conversationTopicRoutes.get("/", conversationTopicController.find);
conversationTopicRoutes.get("/:id", conversationTopicController.findOne);
conversationTopicRoutes.post("/", conversationTopicController.create);
conversationTopicRoutes.put("/:id", conversationTopicController.update);
conversationTopicRoutes.delete("/:id", conversationTopicController.delete);
