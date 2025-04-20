import { CONFLICT } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import IssueReportModel from "./issue-report.model";
import { CreateIssueDto } from "./dto/createIssue.dto";

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
};
