import {z} from "zod";


export const conversationReportSchema = z.string().max(40, { message: "description must be at most 40 characters long" });




export const newConversationReportSchema = z.object({
    description:conversationReportSchema,
    topic:z.string()

})




