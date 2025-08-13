import { z } from "zod";

export const faqItemResponseDto = z.object({
    _id: z.any().transform((val) => val.toString()),
    faqId: z.any().transform((val) => val.toString()),
    question: z.string(),
    answer: z.string(),
});
export type FaqItemResponseDto = z.infer<typeof faqItemResponseDto>;
