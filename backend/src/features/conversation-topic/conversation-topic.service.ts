import { CONFLICT, NOT_FOUND } from "../../constants/http";
import ConversationReportModel from "../conversation-report/conversation-report.model";
import ConversationTopicModel from "./conversation-topic.model";
import appAssert from "../../utils/appAssert";

interface CreateConversationTopicRequest {
    title: string;
    product: string;
}

interface CreateConversationTopicParams {
    request: CreateConversationTopicRequest;
    userId: string;
}

interface GetConversationTopicParams {
    topicId: string;
    userId: string;
}

export const createConversationTopic = async ({ request, userId }: CreateConversationTopicParams) => {
    const { title, product } = request;

    // Sprawdzanie, czy temat rozmowy z tym tytułem dla danego produktu już istnieje
    const conversationTopicExists = await ConversationTopicModel.exists({ title, product });
    appAssert(
        !conversationTopicExists,
        CONFLICT,
        "Conversation topic with this title already exists for the specified product"
    );

    // Tworzenie nowego tematu rozmowy
    const createdConversationTopic = await ConversationTopicModel.create({
        title,
        product,
        createdBy: userId,
    });

    return { data: createdConversationTopic, message: "Conversation topic created successfully" };
};

export const getConversationTopic = async ({ topicId, userId }: GetConversationTopicParams) => {
    const conversationTopic = await ConversationTopicModel.findById({ _id: topicId }).populate([
        { path: "product", select: ["name"] },
    ]);
    return conversationTopic;
};

export const deleteConversationTopic = async ({ topicId }: { topicId: string }) => {
    const conversationTopic = await ConversationTopicModel.findById({ _id: topicId });
    appAssert(conversationTopic, NOT_FOUND, "Conversation topic not found");

    const deleteConversationTopic = await ConversationTopicModel.findByIdAndDelete({ _id: topicId });

    await ConversationReportModel.updateMany({ topic: topicId }, { $set: { topic: null } });

    return { message: "Conversataion topic deleted sucessfully" };
};
