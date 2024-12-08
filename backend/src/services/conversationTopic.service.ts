import { CONFLICT } from "../constants/http";
import ConversationTopicModel from "../models/ConversationTopic.model";
import TagModel from "../models/Tag.model";
import appAssert from "../utils/appAssert";

interface CreateConversationTopicRequest {
    title: string;
    product:string;

  }


interface CreateConversationTopicParams {
    request: CreateConversationTopicRequest;
    userId: string; 
  }

  interface GetConversationTopicParams {
    topicId: string;
    userId: string; 
  }

export const createConversationTopic = async({request, userId}:CreateConversationTopicParams)=>{
    const {title,product} = request;

    const conversationTopic = await ConversationTopicModel.exists({title});
    appAssert(!conversationTopic, CONFLICT, "Conversation topic already exists");

    const createdConversationTopic = await ConversationTopicModel.create({
        title,
        product,
        createdBy:userId
    })
    return createdConversationTopic;
}

export const getConversationTopic = async({topicId, userId}:GetConversationTopicParams)=>{

const conversationTopic = await ConversationTopicModel.findById({_id:topicId}).populate([{ path: "product", select: ["name"] }]);
return conversationTopic; 

}