import { z } from "zod";

export const createFaqDto = z.object({
    title: z.string().trim().min(3).max(255),
    slug: z.string().trim().min(3).max(255),
    description: z.string().trim().min(3).max(255),
    iconKey: z.string(),
    labelColor: z.string(),
    questions: z
        .array(
            z.object({
                question: z.string(),
                answer: z.string(),
            })
        )
        .nonempty(),
});
export type CreateFaqDto = z.infer<typeof createFaqDto>;
