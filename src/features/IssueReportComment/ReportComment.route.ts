import { Router } from "express";
import { ReportCommentController } from "./ReportComment.controller";

const reportCommentController = ReportCommentController();
// prefix /report-comments
export const ReportCommentRoutes = Router();
ReportCommentRoutes.get("/:reportId", reportCommentController.find);
ReportCommentRoutes.post("/:reportId", reportCommentController.create);
