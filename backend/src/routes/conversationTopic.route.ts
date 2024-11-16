import { Router } from "express";
import { createConversationTopicHandler } from "../controllers/conversationTopic.controller";




const conversationTopicRoutes = Router();

// prefix /conversation-topics

conversationTopicRoutes.get("/")
conversationTopicRoutes.post("/create", createConversationTopicHandler);



export default conversationTopicRoutes;