import { Router } from "express";
import { ConversationTopicController } from "./conversation-topic.controller";

export const conversationTopicRoutes = Router();
export const conversationTopicController = ConversationTopicController();

// prefix /conversation-topics

conversationTopicRoutes.get("/", conversationTopicController.find);
conversationTopicRoutes.get("/:id", conversationTopicController.findOne);
conversationTopicRoutes.post("/create", conversationTopicController.create);
conversationTopicRoutes.put("/topic/:id/update", conversationTopicController.update);
conversationTopicRoutes.delete("/topic/:id/delete", conversationTopicController.delete);
