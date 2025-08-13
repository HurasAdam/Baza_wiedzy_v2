// dto/faqItemResponseDto.ts
import { Types } from "mongoose";
import { z } from "zod";

export const faqItemResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((val) => val.toString()),
    faqId: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((val) => val.toString()),
    question: z.string(),
    answer: z.string(),
});

export type FaqItemResponseDto = z.infer<typeof faqItemResponseDto>;
