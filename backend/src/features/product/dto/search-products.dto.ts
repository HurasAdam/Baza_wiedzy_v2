import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchProductsDto = searchDto.extend({
    name: z.string().optional(),
});

export type SearchProductsDto = z.infer<typeof searchProductsDto>;
