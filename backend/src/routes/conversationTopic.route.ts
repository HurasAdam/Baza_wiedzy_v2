import { Router } from "express";
import { createConversationTopicHandler, getConversationTopicsHandler } from "../controllers/conversationTopic.controller";




const conversationTopicRoutes = Router();

// prefix /conversation-topics

conversationTopicRoutes.get("/",getConversationTopicsHandler)
conversationTopicRoutes.post("/create", createConversationTopicHandler);

export default conversationTopicRoutes;