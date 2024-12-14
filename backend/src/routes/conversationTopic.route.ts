import { Router } from "express";
import { createConversationTopicHandler, getConversationTopicsHandler, getSingleConversationTopicHandler, updateConversationTopicleHandler } from "../controllers/conversationTopic.controller";




const conversationTopicRoutes = Router();

// prefix /conversation-topics

conversationTopicRoutes.get("/",getConversationTopicsHandler);
conversationTopicRoutes.get("/:id",getSingleConversationTopicHandler);
conversationTopicRoutes.post("/create", createConversationTopicHandler);
conversationTopicRoutes.put("/topic/:id/update", updateConversationTopicleHandler);

export default conversationTopicRoutes;