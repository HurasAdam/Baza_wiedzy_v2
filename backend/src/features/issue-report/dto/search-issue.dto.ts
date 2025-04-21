import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchIssuesDto = searchDto.extend({
    title: z.string().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
    isUnread: z.string().optional(),
    verified: z.string().optional(),
});

export type SearchIssuesDto = z.infer<typeof searchIssuesDto>;
