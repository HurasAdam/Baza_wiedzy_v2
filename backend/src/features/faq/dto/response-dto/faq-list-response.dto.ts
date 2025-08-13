// dto/faqListResponseDto.ts
import { Types } from "mongoose";
import { z } from "zod";

export const faqListResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    labelColor: z.string(),
    isDefault: z.boolean(),
    iconKey: z.string(),
    status: z.string(),
    createdAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
    updatedAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

export type FaqListResponseDto = z.infer<typeof faqListResponseDto>;
