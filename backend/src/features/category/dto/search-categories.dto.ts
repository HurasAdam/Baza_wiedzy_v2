import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchCategoriesDto = searchDto.extend({});

export type SearchCategoriesDto = z.infer<typeof searchCategoriesDto>;
