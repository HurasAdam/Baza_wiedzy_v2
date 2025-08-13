import { searchDto } from "@/common/dto/search.dto";
import { z } from "zod";

export const searchFaqDto = searchDto.extend({
    title: z.string().optional(),
});

export type SearchFaqDto = z.infer<typeof searchFaqDto>;
