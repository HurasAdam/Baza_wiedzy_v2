import { Router } from "express";
import {
  addConversationReportHandler,
  getAllCoversationReportsHandler,
  getAllReports,
} from "../controllers/conversationReport.controller";

const conversationReportRoutes = Router();

// prefix /conversation-report

conversationReportRoutes.get("/", getAllCoversationReportsHandler);
conversationReportRoutes.get("/all", getAllReports);
conversationReportRoutes.post("/add", addConversationReportHandler);

export default conversationReportRoutes;
