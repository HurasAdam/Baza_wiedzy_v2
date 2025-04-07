import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchArticlesDto = searchDto.extend({
    title: z.string().optional(),

    tags: z.union([z.array(z.string()), z.string()]).optional(),

    product: z.string().optional(),

    author: z.string().optional(),

    verified: z.string().optional(),
});

export type SearchArticlesDto = z.infer<typeof searchArticlesDto>;
