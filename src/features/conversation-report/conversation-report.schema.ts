import { z } from "zod";

export const conversationReportSchema = z
    .string()
    .max(190, { message: "description must be at most 190 characters long" });

export const newConversationReportSchema = z.object({
    description: conversationReportSchema,
    topic: z.string(),
    type: z.enum(["call", "message"]),
    count: z.number().min(1).max(20).default(1),
});
export type CreateConversationReportRequest = z.infer<typeof newConversationReportSchema>;
