import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import IssueReportModel from "./issue-report.model";
import { CreateIssueDto } from "./dto/create-issue.dto";

export const IssueReportService = {
    async create(userId: string, payload: CreateIssueDto) {
        // const issueReport = await IssueReportModel.exists({ title: payload.title });
        // appAssert(!issueReport, CONFLICT, "Issue already exists");

        const Issue = await IssueReportModel.create({
            ...payload,
            createdBy: userId,
        });

        return { data: Issue, message: "Zgłoszenie zostało wysłane" };
    },
    async find(userId, payload) {
        const issueReports = await IssueReportModel.find({}).select(["-createdBy"]).populate({
            path: "createdBy",
            select: "name surname email",
        });

        return issueReports;
    },
    async findOne(issueReportId) {
        const issueReport = await IssueReportModel.findById({ _id: issueReportId }).populate({
            path: "createdBy",
            select: "name surname email",
        });
        appAssert(issueReport, NOT_FOUND, "Issue report not found");
        return issueReport;
    },
};
