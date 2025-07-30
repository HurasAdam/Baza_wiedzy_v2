import { z } from "zod";
import { searchDto } from "@/common/dto/search.dto";

export const searchProjectsDto = searchDto.extend({
    name: z.string().optional(),
});

export type SearchProjectsDto = z.infer<typeof searchProjectsDto>;
