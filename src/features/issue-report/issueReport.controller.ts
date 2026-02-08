import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";

import { objectIdParam } from "../../common/dto/params-id.dto";
import { createIssueDto } from "./dto/create-issue.dto";
import { searchIssuesDto } from "./dto/search-issue.dto";
import { updateIssueStatusDto } from "./dto/update-issue-status.dto";
import { IssueReportService } from "./issueReport.service";

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
    findMyReports: catchErrors(async ({ userId, query }, res) => {
        const payload = searchIssuesDto.parse(query);
        const myIssueReports = await issueReportService.findMyReports(userId, payload);
        return res.status(OK).json(myIssueReports);
    }),

    updateStatus: catchErrors(async ({ params, body }, res) => {
        const { id } = objectIdParam("id").parse(params);
        const payload = updateIssueStatusDto.parse(body);
        const updatedReport = await issueReportService.updateStatus(id, payload);
        return res.status(OK).json(updatedReport);
    }),

    deleteReport: catchErrors(async ({ params }, res) => {
        const { id } = params;
        const result = await issueReportService.deleteReport(id);
        return res.status(OK).json(result);
    }),
});
