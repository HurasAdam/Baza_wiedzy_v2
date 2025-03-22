import { Router } from "express";
import { ConversationReportController } from "./conversation-report.controller";

export const conversationReportRoutes = Router();
const conversationReportController = ConversationReportController();

// prefix /conversation-report

conversationReportRoutes.get("/", conversationReportController.find);
conversationReportRoutes.post("/", conversationReportController.create);
