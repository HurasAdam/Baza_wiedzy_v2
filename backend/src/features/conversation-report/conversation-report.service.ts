import { CONFLICT } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import ConversationTopicModel from "../conversation-topic/conversation-topic.model";
import ConversationReportModel from "./conversation-report.model";

interface CreateConversationTopicRequest {
    description?: string;
    topic: string;
    type: string;
}

export const ConversationReportService = {
    async addConversationReport(userId: string, payload: CreateConversationTopicRequest) {
        const { topic, description, type } = payload;

        const conversationTopic = await ConversationTopicModel.exists({ topic });
        appAssert(!conversationTopic, CONFLICT, "Conversation topic does not exist");

        const createdConversationTopic = await ConversationReportModel.create({
            description,
            type,
            createdBy: userId,
            topic,
        });
        return createdConversationTopic;
    },
};
