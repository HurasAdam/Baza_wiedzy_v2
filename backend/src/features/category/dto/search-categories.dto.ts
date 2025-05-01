import { searchDto } from "@/common/dto/search.dto";
import { z } from "zod";

export const searchCategoriesDto = searchDto.extend({
    name: z.string().optional(),
});

// **Tu eksportujemy typ** ‒ dzięki temu w service będziesz mieć limit/page!
export type SearchCategoriesDto = z.infer<typeof searchCategoriesDto>;
