import { OK } from "../constants/http";
import ConversationTopicModel from "../models/ConversationTopic.model";
import { createConversationTopic, getConversationTopic } from "../services/conversationTopic.service";
import catchErrors from "../utils/catchErrors";
import { constructSearchQuery } from "../utils/constructSearchQuery";
import { conversationTopicSchema, newConversationTopicSchema } from "./conversationTopic.schema";

export const createConversationTopicHandler = catchErrors(
    async(req,res)=>{
        const request = newConversationTopicSchema.parse(req.body);
        const {userId} = req
        const newTag= await createConversationTopic({request, userId});

console.log(newTag);
return res.status(OK).json(newTag)

    }
)

export const getConversationTopicsHandler = catchErrors(
    async(req,res)=>{

console.log(req.query)

        const query = constructSearchQuery(req.query);
        const conversationTopics = await ConversationTopicModel.find(query)
        .populate([{ path: "product", select: ["name", "labelColor", "-_id"] }])  // Załadowanie produktów
        .sort('product.name');  // Sortowanie według nazwy produktu
      return res.status(OK).json(conversationTopics);
    }
)


export const getSingleConversationTopicHandler = catchErrors(
    async(req,res)=>{
        const {id}= req.params;
        const {userId}:{userId:string} = req;
        const conversationTopic = await getConversationTopic({userId,topicId:id});
        return res.status(OK).json(conversationTopic);
    }
)