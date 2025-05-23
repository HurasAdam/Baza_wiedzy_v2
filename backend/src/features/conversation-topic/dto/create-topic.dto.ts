import { z } from "zod";

export const conversationTopicSchema = z
    .string()
    .min(2, { message: "Conversation title must be at least 2 characters long" })
    .max(40, { message: "Conversation title must be at most 40 characters long" });

export const createTopicDto = z.object({
    title: conversationTopicSchema,
    product: z.string(),
});

export type CreateTopicDto = z.infer<typeof createTopicDto>;
