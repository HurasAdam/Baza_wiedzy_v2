import { z } from "zod";

export const createFaqItemDto = z.object({
    question: z.string().min(3).max(200),
    answer: z.string().min(3).max(2000),
});

export type CreateFaqItemDto = z.infer<typeof createFaqItemDto>;
