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
});

export type SearchArticlesDto = z.infer<typeof searchArticlesDto>;
