import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";

import { IssueReportService } from "./issueReport.service";
import { createIssueDto } from "./dto/createIssue.dto";

export const IssueReportController = (issueReportService = IssueReportService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createIssueDto.parse(body);
        const issueReport = await issueReportService.create(userId, payload);
        return res.status(OK).json(issueReport);
    }),
});
