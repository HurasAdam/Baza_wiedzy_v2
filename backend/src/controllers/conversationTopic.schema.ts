import {z} from "zod";


export const conversationTopicSchema = z.string().min(2, { message: "Title must be at least 2 characters long" }).max(40, { message: "Title must be at most 40 characters long" });




export const newConversationTopicSchema = z.object({
    title:conversationTopicSchema,

})




