import { OK } from "../constants/http";
import { createConversationTopic } from "../services/conversationTopic.service";
import catchErrors from "../utils/catchErrors";
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