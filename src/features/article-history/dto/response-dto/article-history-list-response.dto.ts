// dto/faqListResponseDto.ts
import { Types } from "mongoose";
import { z } from "zod";

export const articleHistoryListResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    eventType: z.string(),
    createdBy: z.object({
        _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
        name: z.string(),
        surname: z.string(),
    }),

    createdAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

export type ArticleHistoryListResponseDto = z.infer<typeof articleHistoryListResponseDto>;
