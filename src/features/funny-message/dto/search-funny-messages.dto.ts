import { searchDto } from "@/common/dto/search.dto";
import { z } from "zod";

export const searchFunnyMessagesDto = searchDto.extend({
    title: z.string().optional(),
    author: z.string().optional(),
    sortBy: z.string().default("createdAt"),
    sortAt: z.preprocess((val) => (val ? Number(val) : -1), z.number().int()).default(-1),
    page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).max(50).default(20)),
});

export type SearchFunnyMessagesDto = z.infer<typeof searchFunnyMessagesDto>;
