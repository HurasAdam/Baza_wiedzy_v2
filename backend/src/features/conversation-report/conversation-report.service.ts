import { CONFLICT } from "../../constants/http";
import ConversationReportModel from "./conversation-report.model";
import ConversationTopicModel from "../conversation-topic/conversation-topic.model";
import TagModel from "../tag/tag.model";
import appAssert from "../../utils/appAssert";

interface CreateConversationTopicRequest {
    description?: string;
    topic: string;
}

interface CreateConversationTopicParams {
    request: CreateConversationTopicRequest;
    userId: string;
}

export const addConversationReport = async ({ request, userId }: CreateConversationTopicParams) => {
    const { topic, description } = request;

    const conversationTopic = await ConversationTopicModel.exists({ topic });
    appAssert(!conversationTopic, CONFLICT, "Conversation topic does not exist");

    const createdConversationTopic = await ConversationReportModel.create({
        description,
        createdBy: userId,
        topic,
    });
    return createdConversationTopic;
};
