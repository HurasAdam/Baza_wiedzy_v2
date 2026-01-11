import { Router } from "express";
import { Permissions } from "../../enums/role.enum";
import permissionGuard from "../../middleware/permissionGuard";
import { IssueReportController } from "./issueReport.controller";

const issueReportController = IssueReportController();
// prefix /issue-report
export const IssueReportRoutes = Router();
IssueReportRoutes.post("/", permissionGuard(Permissions.SEND_REPORT), issueReportController.create);
IssueReportRoutes.get("/", issueReportController.find);
IssueReportRoutes.get("/mine", issueReportController.findMyReports);
IssueReportRoutes.get("/:id", issueReportController.findOne);
IssueReportRoutes.patch(
    "/:id/status",
    permissionGuard(Permissions.MANAGE_REPORT_STATUS),
    issueReportController.updateStatus
);
