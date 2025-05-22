import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import ConversationReportModel from "./conversation-report.model";
import { newConversationReportSchema } from "./conversation-report.schema";
import { ConversationReportService } from "./conversation-report.service";

export const ConversationReportController = (conversationReportService = ConversationReportService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const request = newConversationReportSchema.parse(body);

        const newTag = await conversationReportService.addConversationReport(userId, request);

        return res.status(OK).json(newTag);
    }),

    find: catchErrors(async (req, res) => {
        const allConversationReports = await ConversationReportModel.find({});
        return res.status(OK).json(allConversationReports);
    }),
    findByUser: catchErrors(async ({ params, query }, res) => {
        const { userId } = params;

        const reports = await conversationReportService.findByUser(userId, query);
        return res.status(200).json(reports);
    }),
});
