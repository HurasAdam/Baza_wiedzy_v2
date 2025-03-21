import { Router } from "express";
import { ConversationReportController } from "./conversation-report.controller";

export const conversationReportRoutes = Router();
const conversationReportController = ConversationReportController();

// prefix /conversation-report

conversationReportRoutes.get("/", conversationReportController.getAllCoversationReports);
conversationReportRoutes.get("/all", conversationReportController.getAllReports);
conversationReportRoutes.post("/add", conversationReportController.create);
