import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchTagDto = searchDto.extend({
    name: z.string().optional(),
});

export type SearchTagDto = z.infer<typeof searchTagDto>;
