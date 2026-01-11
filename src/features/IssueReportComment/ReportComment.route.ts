import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { ReportCommentController } from "./ReportComment.controller";

const reportCommentController = ReportCommentController();
// prefix /report-comments
export const ReportCommentRoutes = Router();
ReportCommentRoutes.get("/:reportId", reportCommentController.find);
ReportCommentRoutes.post("/:reportId", permissionGuard(Permissions.ADD_REPORT_COMMENT), reportCommentController.create);
