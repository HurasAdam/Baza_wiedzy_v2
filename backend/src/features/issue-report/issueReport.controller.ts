import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";

import { IssueReportService } from "./issueReport.service";
import { createIssueDto } from "./dto/create-issue.dto";
import { searchIssuesDto } from "./dto/search-issue.dto";

export const IssueReportController = (issueReportService = IssueReportService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createIssueDto.parse(body);
        const issueReport = await issueReportService.create(userId, payload);
        return res.status(OK).json(issueReport);
    }),
    find: catchErrors(async ({ userId, query }, res) => {
        const payload = searchIssuesDto.parse(query);
        const IssueReports = await issueReportService.find(userId, payload);
        return res.status(OK).json(IssueReports);
    }),

    findOne: catchErrors(async ({ userId, params }, res) => {
        const issueReport = await issueReportService.findOne(params.id);
        await issueReportService.markAsRead(issueReport?._id.toString());
        return res.status(OK).json(issueReport);
    }),
    findMyReports: catchErrors(async ({ userId, params }, res) => {
        const myIssueReports = await issueReportService.findMyReports(userId);
        return res.status(OK).json(myIssueReports);
    }),
});
