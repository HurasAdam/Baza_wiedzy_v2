// dto/faqResponseDto
import { Types } from "mongoose";
import { z } from "zod";

export const faqResponseDto = z.object({
    _id: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    labelColor: z.string(),
    isDefault: z.boolean(),
    iconKey: z.string(),
    status: z.string(),
    createdBy: z.union([z.string(), z.instanceof(Types.ObjectId)]).transform((v) => v.toString()),
    createdAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
    updatedAt: z.union([z.string(), z.date()]).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

export type FaqResponseDto = z.infer<typeof faqResponseDto>;
