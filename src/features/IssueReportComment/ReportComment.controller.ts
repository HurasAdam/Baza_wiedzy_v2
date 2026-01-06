import { NO_CONTENT, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { objectIdParam } from "../../common/dto/params-id.dto";
import { createReportCommentDto } from "./dto/create-report-comment.dto";
import { ReportCommentService } from "./ReportComment.service";

export const ReportCommentController = (reportCommentService = ReportCommentService) => ({
    create: catchErrors(async ({ userId, params, body }, res) => {
        const { reportId } = objectIdParam("reportId").parse(params);
        const payload = createReportCommentDto.parse(body);
        await reportCommentService.create(userId, reportId, payload);
        return res.sendStatus(NO_CONTENT);
    }),

    find: catchErrors(async ({ userId, params }, res) => {
        const { reportId } = objectIdParam("reportId").parse(params);

        const serviceResponse = await reportCommentService.find(reportId);
        return res.status(OK).json(serviceResponse);
    }),
});
