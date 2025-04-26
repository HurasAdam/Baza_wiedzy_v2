import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchCategoriesDto = searchDto.extend({
    name: z.string().optional(),
});

export type SearchCategoriesDto = z.infer<typeof searchCategoriesDto>;
