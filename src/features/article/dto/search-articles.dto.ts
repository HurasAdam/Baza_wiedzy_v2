import { searchDto } from "@/common/dto/search.dto";
import { z } from "zod";

export const searchArticlesDto = searchDto.extend({
    title: z.string().optional(),

    tags: z.union([z.array(z.string()), z.string()]).optional(),

    product: z.string().optional(),

    author: z.string().optional(),

    category: z.string().optional(),

    verified: z.string().optional(),

    status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),

    page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).default(1)),
    limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).max(50).default(50)),
    searchInContent: z.preprocess((v) => (v === "true" || v === true ? true : false), z.boolean().default(false)),
});

export type SearchArticlesDto = z.infer<typeof searchArticlesDto>;
