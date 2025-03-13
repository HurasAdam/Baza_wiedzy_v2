import { CONFLICT } from "../constants/http";
import ConversationReportModel from "../models/ConversationReport.model";
import ConversationTopicModel from "../models/ConversationTopic.model";
import TagModel from "../models/Tag.model";
import appAssert from "../utils/appAssert";

interface CreateConversationTopicRequest {
    description?: string;
    topic:string
  }


interface CreateConversationTopicParams {
    request: CreateConversationTopicRequest;
    userId: string; 
  }

export const addConversationReport = async({request, userId}:CreateConversationTopicParams)=>{
    const {topic,description} = request;

    const conversationTopic = await ConversationTopicModel.exists({topic});
    appAssert(!conversationTopic, CONFLICT, "Conversation topic does not exist");

    const createdConversationTopic = await ConversationReportModel.create({
        description,
        createdBy:userId,
        topic
    })
    return createdConversationTopic;
}