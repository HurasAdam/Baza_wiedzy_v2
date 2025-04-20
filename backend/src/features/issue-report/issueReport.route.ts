import { Router } from "express";
import { IssueReportController } from "./issueReport.controller";

const issueReportController = IssueReportController();
// prefix /issue-report
export const IssueReportRoutes = Router();
IssueReportRoutes.post("/", issueReportController.create);
