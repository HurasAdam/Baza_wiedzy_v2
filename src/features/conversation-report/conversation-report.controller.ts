import { OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { newConversationReportSchema } from "./conversation-report.schema";
import { ConversationReportService } from "./conversation-report.service";
import { topicReportsFilterDto } from "./dto/search-popular-topic-report.dto";

export const ConversationReportController = (conversationReportService = ConversationReportService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const request = newConversationReportSchema.parse(body);

        const newTag = await conversationReportService.addConversationReport(userId, request);

        return res.status(OK).json(newTag);
    }),

    find: catchErrors(async ({ query }, res) => {
        console.log(query, "QUERY TOPIC");
        const payload = topicReportsFilterDto.parse(query);
        const result = await conversationReportService.find(payload);

        return res.status(OK).json(result);
    }),
    findByUser: catchErrors(async ({ params, query }, res) => {
        const { userId } = params;

        const reports = await conversationReportService.findByUser(userId, query);
        return res.status(200).json(reports);
    }),
});
