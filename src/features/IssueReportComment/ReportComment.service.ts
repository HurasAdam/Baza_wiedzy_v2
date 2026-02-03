import { NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import IssueReportModel from "../issue-report/issue-report.model";
import { CreateReportCommentDto } from "./dto/create-report-comment.dto";
import ReportCommentModel from "./Report-comment.model";

export const ReportCommentService = {
    async create(userId: string, reportId: string, body: CreateReportCommentDto) {
        const report = await IssueReportModel.findById(reportId);
        appAssert(report, NOT_FOUND, "Nie znaleziono zgłoszenia");

        await ReportCommentModel.create({
            ...body,
            createdBy: userId,
            report: reportId,
        });
    },

    async find(reportId: string) {
        const report = await IssueReportModel.findById(reportId);
        appAssert(report, NOT_FOUND, "Nie znaleziono zgłoszenia");
        const reportComments = await ReportCommentModel.find({ report: reportId })
            .populate({
                path: "createdBy",
                select: "name surname email",
            })
            .sort({ createdAt: -1 });
        return reportComments;
    },
};
