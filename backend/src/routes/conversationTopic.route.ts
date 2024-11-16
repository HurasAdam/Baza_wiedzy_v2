import { Router } from "express";




const conversationTopicRoutes = Router();

// prefix /conversation-topics

conversationTopicRoutes.get("/")
conversationTopicRoutes.post("/create");



export default conversationTopicRoutes;