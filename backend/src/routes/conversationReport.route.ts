import { Router } from "express";
import { addConversationReportHandler } from "../controllers/conversationReport.controller";




const conversationReportRoutes = Router();

// prefix /conversation

conversationReportRoutes.get("/",)
conversationReportRoutes.post("/add",addConversationReportHandler);



export default conversationReportRoutes;