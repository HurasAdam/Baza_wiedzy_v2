import { Router } from "express";
import { createConversationTopicHandler, getConversationTopicsHandler, getSingleConversationTopicHandler } from "../controllers/conversationTopic.controller";




const conversationTopicRoutes = Router();

// prefix /conversation-topics

conversationTopicRoutes.get("/",getConversationTopicsHandler);
conversationTopicRoutes.get("/:id",getSingleConversationTopicHandler);
conversationTopicRoutes.post("/create", createConversationTopicHandler);

export default conversationTopicRoutes;