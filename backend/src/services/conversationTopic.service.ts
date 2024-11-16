import { CONFLICT } from "../constants/http";
import ConversationTopicModel from "../models/ConversationTopic.model";
import TagModel from "../models/Tag.model";
import appAssert from "../utils/appAssert";

interface CreateConversationTopicRequest {
    title: string;

  }


interface CreateConversationTopicParams {
    request: CreateConversationTopicRequest;
    userId: string; 
  }

export const createConversationTopic = async({request, userId}:CreateConversationTopicParams)=>{
    const {title} = request;

    const conversationTopic = await ConversationTopicModel.exists({title});
    appAssert(!conversationTopic, CONFLICT, "Conversation topic already exists");

    const createdConversationTopic = await ConversationTopicModel.create({
        title,
        createdBy:userId
    })
    return createdConversationTopic;
}